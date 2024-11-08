<?php declare(strict_types=1);

namespace App\Command;

use App\Controller\Common\Api\File\UploadFileController;
use App\Repository\FileRepository;
use Doctrine\ORM\EntityManagerInterface;
use Imagine\Image\Metadata\ExifMetadataReader;
use Imagine\Imagick\Imagine;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:gallery:refresh-taken-on',
    description: 'Refreshes the DB metadata from the stored image files exif data',
)]
class RefreshGalleryTakenOnFromFile extends Command
{
    public function __construct(
        private readonly FileRepository $fileRepository,
        private readonly FilesystemOperator $defaultStorage,
        private readonly EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setHelp('This command allows you to refresh the taken_on metadata from the stored image files exif data')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $filesToCheck = $this->fileRepository->findByHasMetadata();

        try {
            $imagine = new Imagine();

            $batchCount = 100;
            $i = 0;
            foreach ($filesToCheck as $file) {
                $imageFile = UploadFileController::createTempFile($file->getOriginalFilename(), $file->getMimeType());
                $contentStream = $this->defaultStorage->readStream($file->getPath());
                file_put_contents($imageFile->getPathname(), $contentStream);

                $image = $imagine
                    ->setMetadataReader(new ExifMetadataReader())
                    ->open($imageFile->getPathname())
                ;

                $takenOnTmp = $file->getMetadata()['taken_on'] ?? null;
                $takenOn = \is_string($takenOnTmp) && $takenOnTmp !== ''
                    ? \DateTimeImmutable::createFromFormat(\DateTimeInterface::ATOM, $takenOnTmp)
                    : null;

                $takenOnToUpdateTmp = $image->metadata()->get('exif.DateTimeOriginal');
                $takenOnToUpdate = \is_string($takenOnToUpdateTmp) && $takenOnToUpdateTmp !== ''
                    ? \DateTimeImmutable::createFromFormat('Y:m:d H:i:s', $takenOnToUpdateTmp)
                    : null;

                if ($takenOn === false) {
                    $io->writeln('File ID '.$file->getId().' has invalid existing date "'.$takenOnTmp.'"');

                    continue;
                }

                if ($takenOnToUpdate === null) {
                    $io->writeln('File ID '.$file->getId().' has no exif DateTimeOriginal metadata');

                    continue;
                }

                if ($takenOnToUpdate === false) {
                    $io->writeln('File ID '.$file->getId().' has invalid exif DateTimeOriginal metadata "'.$takenOnToUpdateTmp.'"');

                    continue;
                }

                if ($takenOn !== null && $takenOn->format(\DateTimeInterface::ATOM) === $takenOnToUpdate->format(\DateTimeInterface::ATOM)) {
                    $io->writeln('File ID '.$file->getId().' already up to date ('.$takenOn->format('Y-m-d H:i:s').')');

                    continue;
                }

                $file->setMetadata(array_merge($file->getMetadata() ?? [], [
                    'taken_on' => $takenOnToUpdate->format(\DateTimeInterface::ATOM),
                ]));

                ++$i;
                if ($i % $batchCount === 0) {
                    $io->writeln('Flushing...');
                    $this->em->flush();
                }

                $io->writeln('File ID '.$file->getId().' updated from '.($takenOn?->format('Y-m-d H:i:s') ?? 'N/A').' to '.$takenOnToUpdate->format('Y-m-d H:i:s'));
            }

            $io->writeln('Flushing...');
            $this->em->flush();

            $io->success('Gallery taken_on metadata updated successfully');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error($e->getMessage());

            return Command::FAILURE;
        }
    }
}
