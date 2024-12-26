<?php declare(strict_types=1);

namespace App\Service;

use App\Entity\File;
use League\Flysystem\FilesystemException;
use League\Flysystem\FilesystemOperator;
use League\Flysystem\UnableToWriteFile;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\AbstractUnicodeString;
use Symfony\Component\String\Slugger\SluggerInterface;

readonly class FileHelper
{
    public function __construct(
        private FilesystemOperator $defaultStorage,
        private SluggerInterface $slugger,
    ) {}

    public static function createTempFile(string $originalName, ?string $mimeType = null): UploadedFile
    {
        $file = tmpfile();
        if ($file === false) {
            throw new \RuntimeException('Failed to create temporary file');
        }

        return new UploadedFile(stream_get_meta_data($file)['uri'], $originalName, $mimeType);
    }

    /**
     * @param array<false|string> $checksums
     */
    public static function checksumMatches(array $checksums): bool
    {
        return \count(array_unique($checksums)) === 1;
    }

    public static function mimeTypeIsImage(?string $mimeType): bool
    {
        return \in_array($mimeType, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true);
    }

    public function getSafeFilename(UploadedFile $file): AbstractUnicodeString
    {
        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

        return $this->slugger->slug($originalFilename);
    }

    public function writeRemoteFileToTmp(File $file): UploadedFile
    {
        $imageFile = self::createTempFile($file->getOriginalFilename(), $file->getMimeType());
        $contentStream = $this->defaultStorage->readStream($file->getPath());
        file_put_contents($imageFile->getPathname(), $contentStream);

        return $imageFile;
    }

    /**
     * @throws UnableToWriteFile
     * @throws FilesystemException
     */
    public function simpleWriteTmpFileToRemote(UploadedFile $file, string $remoteLocation): void
    {
        $stream = fopen($file->getPathname(), 'r');
        $this->defaultStorage->writeStream($remoteLocation, $stream);
        if (\is_resource($stream)) {
            fclose($stream);
        }
    }
}
