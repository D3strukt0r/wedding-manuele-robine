<?php declare(strict_types=1);

namespace App\Dto\Table;

use Symfony\Component\Validator\Constraints as Assert;

readonly class TablesQueryDto
{
    public function __construct(
        #[Assert\LessThanOrEqual(500)]
        public ?int $limit = 500, // TODO: Reset to 25

        #[Assert\LessThanOrEqual(10_000)]
        public ?int $offset = 0,
    ) {}
}
