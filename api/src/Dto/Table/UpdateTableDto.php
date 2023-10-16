<?php declare(strict_types=1);

namespace App\Dto\Table;

use Symfony\Component\Validator\Constraints as Assert;
use OpenApi\Attributes as OA;

readonly class UpdateTableDto
{
    public function __construct(
        /** @var array<int> */
        #[Assert\NotNull]
        public array $invitees,

        #[Assert\NotNull]
        public int $seats,
    ) {}
}
