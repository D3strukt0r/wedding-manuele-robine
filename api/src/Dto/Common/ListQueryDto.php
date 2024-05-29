<?php declare(strict_types=1);

namespace App\Dto\Common;

use OpenApi\Attributes as OA;
use Symfony\Component\Validator\Constraints as Assert;

readonly class ListQueryDto
{
    public function __construct(
        #[Assert\LessThanOrEqual(500)]
        #[OA\Property(description: 'The field used to limit the number of records returned', example: 10)]
        public int $limit = 25,

        #[Assert\LessThanOrEqual(10_000)]
        #[OA\Property(description: 'The field used to offset the records returned', example: 20)]
        public int $offset = 0,

        #[Assert\NotBlank(allowNull: true)]
        #[OA\Property(description: 'Global search through all searchable columns', example: 'John Doe')]
        public ?string $search = null,

        /** @var array<ListSortersDto> */
        #[Assert\Valid]
        #[OA\Property(description: 'Sort by certain columns', example: [['property' => 'name', 'direction' => 'asc']])]
        public array $sorters = [],

        /** @var array<ListFiltersDto> */
        #[Assert\Valid]
        #[OA\Property(description: 'Filter certain columns', example:[['property' => 'name', 'value' => 'John Doe']])]
        public array $filters = [],
    ) {}
}
