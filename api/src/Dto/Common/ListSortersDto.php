<?php declare(strict_types=1);

namespace App\Dto\Common;

use Symfony\Component\Validator\Constraints as Assert;

readonly class ListSortersDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $property,

        #[Assert\Choice(callback: [SortDirectionEnum::class, 'values'])]
        public SortDirectionEnum $direction = SortDirectionEnum::ASC,
    ) {}
}
