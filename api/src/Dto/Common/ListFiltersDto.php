<?php declare(strict_types=1);

namespace App\Dto\Common;

use Symfony\Component\Validator\Constraints as Assert;

readonly class ListFiltersDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $property,

        #[Assert\NotNull]
        public bool|int|string $value,

        public ?string $operator = null,
    ) {}
}
