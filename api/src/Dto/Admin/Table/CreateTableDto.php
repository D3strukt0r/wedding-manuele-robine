<?php declare(strict_types=1);

namespace App\Dto\Admin\Table;

use OpenApi\Attributes as OA;
use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateTableDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[OA\Property(example: 'Guatemala')]
        public string $name,

        #[Assert\NotNull]
        #[OA\Property(example: 5)]
        public int $seats,

        /** @var array<int> */
        #[OA\Property(example: [1, 2])]
        public array $inviteeIds = [],
    ) {}
}
