<?php declare(strict_types=1);

namespace App\Service;

use Imagine\Image\Metadata\ExifMetadataReader;
use Imagine\Imagick\Imagine;
use Symfony\Component\HttpFoundation\File\UploadedFile;

readonly class GalleryHelper
{
    public static function fixOrientationForExport(UploadedFile $file): void
    {
        $imagine = new Imagine();
        $originalImage = $imagine
            ->setMetadataReader(new ExifMetadataReader())
            ->open($file->getPathname())
        ;

        // Fix rotation of image based on exif metadata (mostly for mobile photos)
        // Was adjusted in UploadFileController, but we need to adjust it back
        // https://medium.com/thetiltblog/fixing-rotated-mobile-image-uploads-in-php-803bb96a852c
        // https://stackoverflow.com/questions/7489742/php-read-exif-data-and-adjust-orientation
        // Somehow `thumbnail.Orientation` is not always set
        $orientation = $originalImage->metadata()->get('ifd0.Orientation');
        $deg = match ($orientation) {
            3 => 180,
            6 => 90,
            8 => -90,
            default => 0, // & 1
        };
        if ($deg !== 0) {
            $originalImage
                ->rotate($deg * -1)
                ->save($file->getPathname())
            ;
        }
    }
}
