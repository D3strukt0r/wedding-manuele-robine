<?php declare(strict_types=1);

namespace App\Dto\Invited;

use OpenApi\Attributes as OA;

readonly class UpdateMyGalleryImagesDto
{
    public function __construct(
        /** @var array<int> */
        #[OA\Property(example: [1, 2])]
        public array $fileIds = [],
    ) {}
}
