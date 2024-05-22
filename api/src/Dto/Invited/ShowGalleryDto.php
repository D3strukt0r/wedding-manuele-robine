<?php declare(strict_types=1);

namespace App\Dto\Invited;

use App\Entity\File;
use League\Flysystem\FilesystemOperator;

readonly class ShowGalleryDto
{
    /** @var array<ShowGalleryImageDto> */
    public array $files;

    /**
     * @param array<File> $files
     */
    public function __construct(array $files, FilesystemOperator $defaultStorage)
    {
        $this->files = array_map(
            static fn (File $file) => new ShowGalleryImageDto($file, $defaultStorage),
            $files,
        );
    }
}
