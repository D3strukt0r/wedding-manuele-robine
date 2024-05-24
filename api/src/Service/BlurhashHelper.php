<?php

namespace App\Service;

use kornrunner\Blurhash\Blurhash;

readonly class BlurhashHelper
{
    public static function encodeFromContent(string $content): string
    {
        $image = imagecreatefromstring($content);
        if ($image === false) {
            throw new \RuntimeException('Failed to load image');
        }
        $width = imagesx($image);
        $height = imagesy($image);

        $pixels = [];
        for ($y = 0; $y < $height; ++$y) {
            $row = [];
            for ($x = 0; $x < $width; ++$x) {
                $index = imagecolorat($image, $x, $y);
                if ($index === false) {
                    throw new \RuntimeException('Failed to get pixel color');
                }
                $colors = imagecolorsforindex($image, $index);

                $row[] = [$colors['red'], $colors['green'], $colors['blue']];
            }
            $pixels[] = $row;
        }

        $components_x = 4;
        $components_y = 3;

        return Blurhash::encode($pixels, $components_x, $components_y);
    }
}
