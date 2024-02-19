<?php declare(strict_types=1);

namespace App\Dto\Admin\Table;

use Symfony\Component\Validator\Constraints as Assert;

readonly class TableCreateDto
{
    public function __construct(
        #[Assert\NotNull]
        public int $seats,

        /** @var array<int> */
        #[Assert\NotNull]
        public array $inviteeIds = [],
    ) {}
}
