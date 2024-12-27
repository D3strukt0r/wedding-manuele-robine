<?php declare(strict_types=1);

namespace App\Message;

class PrepareHugeGalleryDownload implements AsyncMessageInterface
{
    public function __construct(
        public int $galleryDownloadId,
    ) {}
}
