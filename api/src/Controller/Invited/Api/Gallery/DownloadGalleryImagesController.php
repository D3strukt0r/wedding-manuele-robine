<?php declare(strict_types=1);

namespace App\Controller\Invited\Api\Gallery;

use App\Entity\Gallery;
use App\Entity\GalleryDownload;
use App\Message\PrepareHugeGalleryDownload;
use App\Repository\FileRepository;
use App\Repository\GalleryDownloadRepository;
use App\Repository\GalleryRepository;
use App\Service\FileHelper;
use App\Service\GalleryHelper;
use Doctrine\ORM\EntityManagerInterface;
use League\Flysystem\FilesystemOperator;
use OpenApi\Attributes as OA;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DownloadGalleryImagesController extends AbstractController
{
    public function __construct(
        private readonly MessageBusInterface $messageBus,
        private readonly FilesystemOperator $defaultStorage,
        private readonly GalleryRepository $galleryRepository,
        private readonly FileRepository $fileRepository,
        private readonly EntityManagerInterface $em,
        private readonly FileHelper $fileHelper,
        private readonly LoggerInterface $logger,
        private readonly GalleryDownloadRepository $galleryDownloadRepository,
        private readonly int $appDownloadSyncMax,
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
        $requestedScope = $request->query->get('fileIds');

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
            $fileIds = array_map(intval(...), explode(',', $requestedScope));
        }

        // Find db entry for all files and get uppermost parent
        $files = $this->fileRepository->findParentByGivenIds($fileIds);
        if (\count($files) === 0) {
            return $this->json(['message' => 'No files to be downloaded found'], Response::HTTP_NOT_FOUND);
        }

        // Download the single high-res image
        if (\count($files) === 1) {
            $file = $files[0];
            $imageFile = $this->fileHelper->writeRemoteFileToTmp($file);
            GalleryHelper::fixOrientationForExport($imageFile);

            return $this->file($imageFile, $imageFile->getClientOriginalName());
        }

        // Check if we already have the zip file
        $hash = FileRepository::getHashForFileIds($files);
        $location = 'large-downloads/'.$hash.'.zip';
        if ($this->defaultStorage->fileExists($location)) {
            $contentStream = $this->defaultStorage->readStream($location);

            // $zipFile = FileHelper::createTempFile('gallery.zip', 'application/zip');
            // file_put_contents($zipFile->getPathname(), $contentStream);
            //
            // return $this->file($zipFile, $zipFile->getClientOriginalName());

            // https://dev.to/rubenrubiob/serve-a-file-stream-in-symfony-3ei3
            return new StreamedResponse(
                static function () use ($contentStream): void {
                    fpassthru($contentStream);
                },
                Response::HTTP_OK,
                [
                    'Content-Transfer-Encoding', 'binary',
                    'Content-Disposition' => ResponseHeaderBag::DISPOSITION_ATTACHMENT.'; filename="gallery.zip"',
                    'Content-Type' => 'application/zip',
                    'Content-Length' => $this->defaultStorage->fileSize($location),
                ],
            );
        }

        if (\count($files) > $this->appDownloadSyncMax) {
            $galleryDownload = $this->galleryDownloadRepository->findOneBy(['hash' => $hash]);

            if ($galleryDownload === null) {
                $galleryDownload = new GalleryDownload($files);
                $this->em->persist($galleryDownload);
                $this->em->flush();

                $message = new PrepareHugeGalleryDownload($galleryDownload->getId());
                $this->messageBus->dispatch($message); // async
            }

            return $this->json([
                'message' => 'Preparing download, you will be updated shortly',
                'hash' => $galleryDownload->getHash(),
            ], Response::HTTP_ACCEPTED);
        }

        // Compress all high-res images for download
        // https://stackoverflow.com/questions/16121885/php-zip-archive-memory-ram-and-max-file-size
        ini_set('max_execution_time', 100); // Cloudflare timeout is 100s

        $executionStart = microtime(true);

        $zipFile = FileHelper::createTempFile('gallery.zip', 'application/zip');
        $zip = new \ZipArchive();
        $zipOpened = $zip->open($zipFile->getPathname(), \ZipArchive::CREATE);

        if ($zipOpened !== true) {
            throw new \RuntimeException('Failed to open zip file. Error code: '.$zipOpened);
        }

        $i = 0;
        foreach ($files as $fileToAdd) {
            $executionStep = microtime(true);

            $imageFile = $this->fileHelper->writeRemoteFileToTmp($fileToAdd);
            GalleryHelper::fixOrientationForExport($imageFile);

            $filename = $imageFile->getClientOriginalName();
            if ($zip->locateName($filename) !== false) {
                // File with same name already exists in zip, so we need to rename it to avoid conflicts
                // (e.g. IMG_1234.jpg and IMG_1234(1).jpg) and increase the counter
                $extension = pathinfo($filename, PATHINFO_EXTENSION);
                $rawFilename = pathinfo($filename, PATHINFO_FILENAME);
                // Remove possible counter from filename (1), (2), etc.
                $rawFilename = preg_replace('/\(\d+\)$/', '', $rawFilename);

                $counter = 1;
                while ($zip->locateName($rawFilename.'('.$counter.').'.$extension) !== false) {
                    ++$counter;
                }
                $filename = $rawFilename.'('.$counter.').'.$extension;
            }
            $zip->addFile($imageFile->getPathname(), $filename);

            $this->logger->info('Added file {current} of {total} to zip with hash {hash}. Time taken: {time} s. Time taken total: {totalTime} s', [
                'current' => $i,
                'total' => \count($files),
                'hash' => $hash,
                'time' => ceil(microtime(true) - $executionStep),
                'totalTime' => ceil(microtime(true) - $executionStart),
            ]);
        }

        $zip->close();
        unset($zip);

        $executionStep = microtime(true);

        // Save created zip as cache
        $this->fileHelper->simpleWriteTmpFileToRemote($zipFile, $location);

        $this->logger->info('Saved zip with hash {hash} to cache. Time taken: {time} s. Time taken total: {totalTime} s', [
            'hash' => $hash,
            'time' => ceil(microtime(true) - $executionStep),
            'totalTime' => ceil(microtime(true) - $executionStart),
        ]);

        return $this->file($zipFile, $zipFile->getClientOriginalName());
    }
}
