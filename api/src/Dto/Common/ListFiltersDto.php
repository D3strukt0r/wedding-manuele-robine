<?php declare(strict_types=1);

namespace App\Dto\Common;

use Symfony\Component\Validator\Constraints as Assert;

readonly class ListFiltersDto
{
    public function __construct(
        #[Assert\NotBlank]
        public string $property,

        #[Assert\NotNull]
        public string|int|bool $value,

        public ?string $operator = null,
    ) {}
}
