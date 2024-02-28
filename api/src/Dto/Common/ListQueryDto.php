<?php declare(strict_types=1);

namespace App\Dto\Common;

use Symfony\Component\Validator\Constraints as Assert;

readonly class ListQueryDto
{
    public function __construct(
        #[Assert\LessThanOrEqual(500)]
        public int $limit = 500, // TODO: Reset to 25

        #[Assert\LessThanOrEqual(10_000)]
        public int $offset = 0,

        #[Assert\NotBlank(allowNull: true)]
        public ?string $search = null,

        /** @var array<ListSortersDto> */
        public array $sorters = [],

        /** @var array<ListFiltersDto> */
        public array $filters = [],
    ) {}
}
