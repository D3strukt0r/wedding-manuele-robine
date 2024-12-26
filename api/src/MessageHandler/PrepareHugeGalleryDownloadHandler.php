<?php declare(strict_types=1);

namespace App\MessageHandler;

use App\Message\PrepareHugeGalleryDownload;
use App\Repository\FileRepository;
use App\Repository\GalleryDownloadRepository;
use App\Service\FileHelper;
use App\Service\GalleryHelper;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;
use Symfony\Component\Messenger\Exception\UnrecoverableMessageHandlingException;

#[AsMessageHandler]
readonly class PrepareHugeGalleryDownloadHandler
{
    public function __construct(
        private FileRepository $fileRepository,
        private GalleryDownloadRepository $galleryDownloadRepository,
        private EntityManagerInterface $em,
        private LoggerInterface $logger,
        private FileHelper $fileHelper,
    ) {}

    public function __invoke(PrepareHugeGalleryDownload $message): void
    {
        $executionStart = microtime(true);

        $galleryDownload = $this->galleryDownloadRepository->find($message->galleryDownloadId);

        if ($galleryDownload === null) {
            throw new UnrecoverableMessageHandlingException('Gallery download not found');
        }

        // Find db entry for all files
        $files = $this->fileRepository->findParentByGivenIds($galleryDownload->getFileIds());
        if (\count($files) === 0) {
            $this->em->remove($galleryDownload);
            $this->em->flush();

            throw new UnrecoverableMessageHandlingException('No files to be downloaded found');
        }

        // Compress all high-res images for download
        // https://stackoverflow.com/questions/16121885/php-zip-archive-memory-ram-and-max-file-size
        // ini_set('max_execution_time', 600);

        $galleryDownload->setStateCreateZip();
        $this->em->flush();

        $zipFile = FileHelper::createTempFile('gallery.zip', 'application/zip');
        $zip = new \ZipArchive();
        $zipOpened = $zip->open($zipFile->getPathname(), \ZipArchive::CREATE);

        if ($zipOpened !== true) {
            throw new \RuntimeException('Failed to open zip file. Error code: '.$zipOpened);
        }

        $galleryDownload->setStateDownloading();
        $this->em->flush();

        $hash = FileRepository::getHashForFileIds($files);
        $i = 0;
        foreach ($files as $fileToAdd) {
            $executionStep = microtime(true);

            $imageFile = $this->fileHelper->writeRemoteFileToTmp($fileToAdd);
            GalleryHelper::fixOrientationForExport($imageFile);
            $zip->addFile($imageFile->getPathname(), $imageFile->getClientOriginalName());

            $galleryDownload->setStateDownloading(++$i);
            $this->em->flush();

            $this->logger->info('Added file {n} of {m} to zip with hash {hash}. Time taken: {time} s. Time taken total: {totalTime} s', [
                'n' => $i,
                'm' => \count($files),
                'hash' => $hash,
                'time' => ceil(microtime(true) - $executionStep),
                'totalTime' => ceil(microtime(true) - $executionStart),
            ]);
        }

        $zip->close();
        unset($zip);

        $galleryDownload->setStateCaching();
        $this->em->flush();

        $executionStep = microtime(true);

        // Save created zip as cache
        $location = 'large-downloads/'.$hash.'.zip';
        $this->fileHelper->simpleWriteTmpFileToRemote($zipFile, $location);

        $this->logger->info('Saved zip with hash {hash} to cache. Time taken: {time} s. Time taken total: {totalTime} s', [
            'hash' => $hash,
            'time' => ceil(microtime(true) - $executionStep),
            'totalTime' => ceil(microtime(true) - $executionStart),
        ]);

        $this->em->remove($galleryDownload);
        $this->em->flush();
    }
}
