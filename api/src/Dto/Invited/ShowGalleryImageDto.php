<?php declare(strict_types=1);

namespace App\Dto\Invited;

use App\Entity\File;
use League\Flysystem\FilesystemOperator;

readonly class ShowGalleryImageDto
{
    public int $id;
    public string $publicUrl;

    public function __construct(File $file, FilesystemOperator $defaultStorage)
    {
        $id = $file->getId();
        if ($id === null) {
            throw new \InvalidArgumentException('File id cannot be null');
        }
        $this->id = $id;
        $this->publicUrl = $defaultStorage->publicUrl($file->getPath());
    }
}
