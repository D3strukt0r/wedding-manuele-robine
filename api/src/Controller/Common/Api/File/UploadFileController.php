<?php declare(strict_types=1);

namespace App\Controller\Common\Api\File;

use App\Dto\Common\UploadFileDto;
use App\Entity\File;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
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
        /** @var UploadedFile $file */
        $file = $request->files->get('file');

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalFilename);
        $fileName = $safeFilename.'-'.uniqid('', true).'.'.$file->guessExtension();

        $this->defaultStorage->write('gallery/'.$fileName, $file->getContent(), /*['visibility' => 'public', 'directory_visibility' => 'public']*/);

        $size = $this->defaultStorage->fileSize('gallery/'.$fileName);
        $fileEntity = new File($file, 'gallery/'.$fileName, $size);
        $this->em->persist($fileEntity);
        $this->em->flush();

        // Check all checksums
        $checksums = [
            $this->defaultStorage->checksum('gallery/'.$fileName, ['checksum_algo' => 'sha3-256']),
            hash_file('sha3-256', $file->getPathname()),
            $fileEntity->getChecksum(),
        ];
        if (\count(array_unique($checksums)) !== 1) {
            $this->defaultStorage->delete('gallery/'.$fileName);

            $this->em->remove($fileEntity);
            $this->em->flush();

            return $this->json(['error' => 'Checksum mismatch'], Response::HTTP_BAD_REQUEST);
        }

        return $this->json(['record' => [
            'id' => $fileEntity->getId(),
        ]]);
    }
}
