<?php declare(strict_types=1);

namespace App\Controller\Common\Api\File;

use App\Dto\Common\UploadFileDto;
use App\Entity\File;
use App\Entity\User;
use App\Service\BlurhashHelper;
use Doctrine\ORM\EntityManagerInterface;
use Hidehalo\Nanoid\Client;
use Imagine\Image\Format;
use Imagine\Imagick\Imagine;
use League\Flysystem\FilesystemOperator;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\String\AbstractUnicodeString;
use Symfony\Component\String\Slugger\SluggerInterface;

class UploadFileController extends AbstractController
{
    public function __construct(
        private readonly FilesystemOperator $defaultStorage,
        private readonly SluggerInterface $slugger,
        private readonly EntityManagerInterface $em,
    ) {}

    #[Route(
        path: '/file',
        name: 'api_common_file_upload',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(required: true, content: [new OA\MediaType('multipart/form-data', schema: new OA\Schema(
        ref: new Model(type: UploadFileDto::class)
    ))])]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Common/File')]
    public function __invoke(
        #[CurrentUser] User $currentUser,
        Request $request,
    ): JsonResponse {
        $files = $request->files->all();

        /** @var ?UploadedFile $file */
        $file = $files['file'] ?? null;
        if ($file === null) {
            throw new \InvalidArgumentException('No file uploaded');
        }

        // Generate unique filename
        $pathPrefix = 'uploads/';

        $safeFilename = $this->getSafeFilename($file);
        $uniqueId = (new Client())->generateId();

        $childFiles = [];

        $metadata = [];
        if (self::mimeTypeIsImage($file->getMimeType())) {
            $imagine = new Imagine();
            $originalImage = $imagine->open($file->getPathname());
            $metadata['width'] = $originalImage->getSize()->getWidth();
            $metadata['height'] = $originalImage->getSize()->getHeight();

            // Check if file (image) requires compression (>100kb)
            $requiresOptimization = $file->getSize() > (100 * 1024);
            if ($requiresOptimization) {
                // And to an optimized JPEG
                $filename = $safeFilename.'-optimized-'.$uniqueId.'.jpeg';
                $optimizedImage = self::createTempFile($file->getClientOriginalName(), 'image/jpeg');
                $imagine
                    ->open($file->getPathname())
                    ->resize($imagine->open($file->getPathname())->getSize()->widen(500))
                    ->save($optimizedImage->getPathname(), ['format' => Format::ID_JPEG, 'jpeg_quality' => 50])
                ;
                $this->defaultStorage->write($pathPrefix.$filename, $optimizedImage->getContent());
                $childFiles[$filename] = $optimizedImage;
                // Convert to WebP and resize to 500px width with same aspect ratio
                $filename = $safeFilename.'-optimized-'.$uniqueId.'.webp';
                $optimizedImage = self::createTempFile($file->getClientOriginalName(), 'image/webp');
                $originalImage
                    ->resize($originalImage->getSize()->widen(500))
                    ->save($optimizedImage->getPathname(), ['format' => Format::ID_WEBP, 'webp_quality' => 50])
                ;
                $this->defaultStorage->write($pathPrefix.$filename, $optimizedImage->getContent());
                $childFiles[$filename] = $optimizedImage;
            }

            // Add blurhash to metadata if upload was an image
            $content = $requiresOptimization ? $optimizedImage->getContent() : $file->getContent();
            $metadata['blurhash'] = BlurhashHelper::encodeFromContent($content);
        }

        // Upload main file that was uploaded
        $filename = $safeFilename.'-'.$uniqueId.'.'.$file->guessExtension();
        // TODO: Figure out how to make minio directly accessible (e.g. ['visibility' => 'public', 'directory_visibility' => 'public'])
        $this->defaultStorage->write($pathPrefix.$filename, $file->getContent());

        // Create entity for all files with their corresponding relationships
        $filesToCheckForChecksum = [];
        $size = $this->defaultStorage->fileSize($pathPrefix.$filename);
        $fileEntity = new File($file, $pathPrefix.$filename, $size, null, $metadata);
        $this->em->persist($fileEntity);
        $filesToCheckForChecksum[] = ['defaultStoragePath' => $pathPrefix.$filename, 'localFilePath' => $file->getPathname(), 'entity' => $fileEntity];
        foreach ($childFiles as $childFilename => $childFile) {
            $size = $this->defaultStorage->fileSize($pathPrefix.$childFilename);
            $childFileEntity = new File($childFile, $pathPrefix.$childFilename, $size, $fileEntity);
            $this->em->persist($childFileEntity);
            $filesToCheckForChecksum[] = ['defaultStoragePath' => $pathPrefix.$childFilename, 'localFilePath' => $childFile->getPathname(), 'entity' => $childFileEntity];
        }

        // Check all checksums before flushing
        $checksumMismatched = false;
        foreach ($filesToCheckForChecksum as $fileToCheck) {
            if (!self::checksumMatches([
                $this->defaultStorage->checksum($fileToCheck['defaultStoragePath'], ['checksum_algo' => 'sha3-256']),
                hash_file('sha3-256', $fileToCheck['localFilePath']),
                $fileToCheck['entity']->getChecksum(),
            ])) {
                $checksumMismatched = true;

                break;
            }
        }
        if ($checksumMismatched) {
            foreach ($filesToCheckForChecksum as $fileToCheck) {
                $this->defaultStorage->delete($fileToCheck['defaultStoragePath']);
                // $this->em->remove($fileToCheck['entity']); // TODO: Check if this is needed
            }

            throw new \RuntimeException('Checksum mismatch');
        }

        $this->em->flush();

        return $this->json(['record' => [
            'id' => $fileEntity->getId(),
        ]]);
    }

    /**
     * @param array<false|string> $checksums
     */
    private static function checksumMatches(array $checksums): bool
    {
        return \count(array_unique($checksums)) === 1;
    }

    private static function mimeTypeIsImage(?string $mimeType): bool
    {
        return \in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true);
    }

    private static function createTempFile(string $originalName, ?string $mimeType = null): UploadedFile
    {
        $file = tmpfile();
        if ($file === false) {
            throw new \RuntimeException('Failed to create temporary file');
        }

        return new UploadedFile(stream_get_meta_data($file)['uri'], $originalName, $mimeType);
    }

    private function getSafeFilename(UploadedFile $file): AbstractUnicodeString
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

        return $this->slugger->slug($originalFilename);
    }
}
