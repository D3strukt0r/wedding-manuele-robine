<?php declare(strict_types=1);

namespace App\Command;

use App\Entity\File;
use App\Repository\FileRepository;
use App\Repository\GalleryRepository;
use Doctrine\ORM\EntityManagerInterface;
use League\Flysystem\FilesystemException;
use League\Flysystem\FilesystemOperator;
use League\Flysystem\UnableToCheckExistence;
use League\Flysystem\UnableToDeleteFile;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Helper\TableSeparator;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:gallery:clean-unmapped',
    description: 'Cleans all unmapped files in the gallery from DB and S3 (also deletes entities for non existing files)',
)]
class CleanUnmappedGalleryFiles extends Command
{
    public function __construct(
        private readonly GalleryRepository $galleryRepository,
        private readonly FileRepository $fileRepository,
        private readonly FilesystemOperator $defaultStorage,
        private readonly EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setHelp('This command allows you to clean all unmapped files in the gallery from DB and S3 (also deletes entities for non existing files)')
            ->addOption('no-interaction', 'n', InputOption::VALUE_NONE, 'Skip all interactions')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->writeln('Finding non-existing files...');
        $files = $this->fileRepository->findAll();
        $files = array_filter($files, function ($file) {
            try {
                return !$this->defaultStorage->fileExists($file->getPath());
            } catch (FilesystemException|UnableToCheckExistence) {
                return true;
            }
        });
        $this->listFiles($io, $files);

        if (!$input->getOption('no-interaction') && !$io->confirm('Do you want to delete these files?')) {
            $io->writeln('Aborted');

            return Command::SUCCESS;
        }

        $io->writeln('Deleting files...');
        $this->deleteFiles($io, $files, true);

        $io->newLine();
        $io->writeln('Finding unmapped files...');
        $fileIds = $this->galleryRepository->findAllFileIds();
        $files = $this->fileRepository->findByNotGivenIds($fileIds);
        $this->listFilesWithChildren($io, $files);

        if (!$input->getOption('no-interaction') && !$io->confirm('Do you want to delete these files?')) {
            $io->writeln('Aborted');

            return Command::SUCCESS;
        }

        $io->writeln('Deleting files...');
        $this->deleteFilesWithChildren($io, $files);

        return Command::SUCCESS;
    }

    /**
     * @param array<File> $files
     */
    private function listFiles(SymfonyStyle $io, array $files): void
    {
        $rows = [];
        foreach ($files as $index => $file) {
            if ($index > 0) {
                $rows[] = new TableSeparator();
            }
            $rows[] = [$file->getId(), $file->getPath(), $file->getCreatedBy()];
        }
        $io->table(['ID', 'Path', 'Created by'], $rows);
    }

    /**
     * @param array<File> $files
     */
    private function listFilesWithChildren(SymfonyStyle $io, array $files): void
    {
        $rows = [];
        foreach ($files as $index => $file) {
            if ($index > 0) {
                $rows[] = new TableSeparator();
            }
            $rows[] = [$file->getId(), $file->getPath(), $file->getCreatedBy()];
            foreach ($file->getChildren() as $childFile) {
                $rows[] = ['', $childFile->getPath(), $childFile->getCreatedBy()];
            }
        }
        $io->table(['ID', 'Path', 'Created by'], $rows);
    }

    /**
     * @param array<File> $files
     */
    private function deleteFiles(SymfonyStyle $io, array $files, bool $ignoreStorageError = false): void
    {
        $flushInterval = 30;

        foreach ($files as $index => $file) {
            $io->writeln('Deleting file '.$file->getId().' at '.$file->getPath());

            try {
                $this->defaultStorage->delete($file->getPath());
            } catch (FilesystemException|UnableToDeleteFile $exception) {
                if (!$ignoreStorageError) {
                    $io->writeln(' -> Unable to delete file '.$file->getId().' at '.$file->getPath().': '.$exception->getMessage());
                }
            }
            $this->em->remove($file);

            if ($index % $flushInterval === 0) {
                $this->em->flush();
                // $this->em->clear();
            }
        }
    }

    /**
     * @param array<File> $files
     */
    private function deleteFilesWithChildren(SymfonyStyle $io, array $files, bool $ignoreStorageError = false): void
    {
        $flushInterval = 30;

        foreach ($files as $index => $file) {
            $io->writeln('Deleting file '.$file->getId().' at '.$file->getPath());

            foreach ($file->getChildren() as $childFile) {
                $io->writeln(' -> Deleting file '.$childFile->getId().' at '.$childFile->getPath());

                try {
                    $this->defaultStorage->delete($childFile->getPath());
                } catch (FilesystemException|UnableToDeleteFile $exception) {
                    if (!$ignoreStorageError) {
                        $io->writeln(' -> Unable to delete file '.$childFile->getId().' at '.$childFile->getPath().': '.$exception->getMessage());
                    }
                }
                $this->em->remove($childFile);
            }

            try {
                $this->defaultStorage->delete($file->getPath());
            } catch (FilesystemException|UnableToDeleteFile $exception) {
                if (!$ignoreStorageError) {
                    $io->writeln(' -> Unable to delete file '.$file->getId().' at '.$file->getPath().': '.$exception->getMessage());
                }
            }
            $this->em->remove($file);

            if ($index % $flushInterval === 0) {
                $this->em->flush();
                // $this->em->clear();
            }
        }
    }
}
