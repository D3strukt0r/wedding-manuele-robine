<?php declare(strict_types=1);

namespace App\Dto\Common;

use OpenApi\Attributes as OA;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;

class UploadFileDto
{
    public function __construct(
        #[Assert\NotNull]
        #[Assert\File(
            maxSize: '10M',
            // Check \Symfony\Component\Mime\MimeTypes for available mime types
            mimeTypes: ['image/jpeg', 'image/png'],
        )]
        #[OA\Property(type: 'file')]
        public UploadedFile $file,
    ) {}
}
