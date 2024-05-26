<?php declare(strict_types=1);

namespace App\Dto\Invited;

use App\Entity\File;
use App\Service\BlurhashHelper;
use League\Flysystem\FilesystemOperator;

readonly class ListGalleryImageDto
{
    public int $id;
    public string $publicUrl;
    public string $mimeType;
    public string $blurhash;
    public int $height;
    public int $width;
    /** @var array<ListGalleryImageDto> */
    public array $children;

    public function __construct(File $file, FilesystemOperator $defaultStorage)
    {
        $this->id = $file->getId() ?? throw new \InvalidArgumentException('File id cannot be null');
        // $this->publicUrl = $defaultStorage->publicUrl($file->getPath()); // TODO: Somehow directly use minio, but minio is broken
        $this->publicUrl = '/invited/api/gallery/'.$file->getId();
        $this->mimeType = $file->getMimeType() ?? throw new \InvalidArgumentException('File mime type cannot be null');

        $blurhash = $file->getMetadata()['blurhash'] ?? $file->getParent()?->getMetadata()['blurhash'] ?? null;
        if (\is_string($blurhash)) {
            $this->blurhash = $blurhash;
        } else {
            $content = $defaultStorage->read($file->getPath());
            $this->blurhash = BlurhashHelper::encodeFromContent($content);
        }

        $this->height = $file->getMetadata()['height']
            ?? $file->getParent()?->getMetadata()['height']
            ?? throw new \InvalidArgumentException('Image height not found');
        $this->width = $file->getMetadata()['width']
            ?? $file->getParent()?->getMetadata()['width']
            ?? throw new \InvalidArgumentException('Image width not found');
        $this->children = array_map(
            static fn (File $file) => new ListGalleryImageDto($file, $defaultStorage),
            $file->getChildren()->toArray(),
        );
    }
}
