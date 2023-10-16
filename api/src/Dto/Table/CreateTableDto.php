<?php declare(strict_types=1);

namespace App\Dto\Table;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateTableDto
{
    public function __construct(
        /** @var array<int> */
        #[Assert\NotNull]
        public array $invitees,

        #[Assert\NotNull]
        public int $seats,
    ) {}
}
