<?php declare(strict_types=1);

namespace App\Controller\Invited\Api\Gallery;

use App\Controller\Common\Api\File\UploadFileController;
use App\Entity\File;
use App\Entity\Gallery;
use App\Repository\FileRepository;
use App\Repository\GalleryRepository;
use League\Flysystem\FilesystemOperator;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DownloadGalleryImagesController extends AbstractController
{
    public function __construct(
        private readonly FilesystemOperator $defaultStorage,
        private readonly GalleryRepository $galleryRepository,
        private readonly FileRepository $fileRepository,
    ) {}

    #[Route(
        path: '/gallery/download',
        name: 'api_invited_gallery_download',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted('PUBLIC_ACCESS')]
    #[OA\Parameter(name: 'fileIds', description: '"all" or comma-separated list of ids', in: 'query', schema: new OA\Schema(type: 'string', example: '1,5,8'))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns file resource')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Invited/Gallery')]
    public function __invoke(Request $request): Response
    {
        $requestedScope = $request->get('fileIds');

        // Get all fileIds from request
        if ($requestedScope === 'all' || $requestedScope === '' || $requestedScope === null) {
            $gallery = $this->galleryRepository->findAll();

            /** @var array<int> $fileIds */
            $fileIds = array_reduce($gallery,
                static fn (array $carry, Gallery $gallery) => array_merge($carry, $gallery->getFileIds()),
                [],
            );
        } else {
            // TODO: Could also include a file not in the gallery, security issue?
            $fileIds = array_map('intval', explode(',', $requestedScope));
        }

        // Find db entry for all files
        $files = array_map(fn (int $fileId) => $this->fileRepository->find($fileId), $fileIds);
        if (\in_array(null, $files, true)) {
            throw $this->createNotFoundException('At least one of the requested files not found');
        }

        // Get all the high-res parent file for all files
        foreach ($files as $id => $file) {
            while ($file->getParent()) {
                $file = $file->getParent();
            }
            $files[$id] = $file;
        }

        if (count($files) === 0) {
            return new JsonResponse(['message' => 'No files requested, how did you do that?'], Response::HTTP_NOT_FOUND);
        }

        // Download the single high-res image
        if (count($files) === 1) {
            $file = $files[0];
            $imageFile = $this->writeFileToTmp($file);

            return $this->file($imageFile, $imageFile->getClientOriginalName());
        }

        // Check if we already have the zip file
        $sortedFileIds = array_map(static fn (File $file) => $file->getId(), $files);
        sort($sortedFileIds, \SORT_NUMERIC);
        $pathPrefix = 'large-downloads/';
        $zipFileName = hash('sha3-256', implode(',', $sortedFileIds)) . '.zip';
        if ($this->defaultStorage->fileExists($pathPrefix.$zipFileName)) {
            $zipFile = UploadFileController::createTempFile('gallery.zip', 'application/zip');
            $contentStream = $this->defaultStorage->readStream($pathPrefix.$zipFileName);
            file_put_contents($zipFile->getPathname(), $contentStream);

            return $this->file($zipFile, $zipFile->getClientOriginalName());
        }

        // Compress all high-res images for download
        // https://stackoverflow.com/questions/16121885/php-zip-archive-memory-ram-and-max-file-size
        ini_set('max_execution_time', 600); // 10 minutes

        $zipFile = UploadFileController::createTempFile('gallery.zip', 'application/zip');
        $zip = new \ZipArchive;
        $zipOpened = $zip->open($zipFile->getPathname(), \ZipArchive::CREATE);

        if ($zipOpened !== true) {
            throw new \RuntimeException('Failed to open zip file. Error code: ' . $zipOpened);
        }

        foreach ($files as $file) {
            $imageFile = $this->writeFileToTmp($file);
            $zip->addFile($imageFile->getPathname(), $imageFile->getClientOriginalName());
        }

        $zip->close();
        unset($zip);

        // Save created zip as cache
        $zipFileStream = fopen($zipFile->getPathname(), 'rb');
        $this->defaultStorage->writeStream($pathPrefix.$zipFileName, $zipFileStream);
        fclose($zipFileStream);

        return $this->file($zipFile, $zipFile->getClientOriginalName());
    }

    private function writeFileToTmp(File $file): UploadedFile
    {
        $imageFile = UploadFileController::createTempFile($file->getOriginalFilename(), $file->getMimeType());
        $contentStream = $this->defaultStorage->readStream($file->getPath());
        file_put_contents($imageFile->getPathname(), $contentStream);

        return $imageFile;
    }
}
