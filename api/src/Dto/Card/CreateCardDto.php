<?php declare(strict_types=1);

namespace App\Dto\Card;

use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateCardDto
{
    public function __construct(
        /** @var array<int> */
        #[Assert\NotNull]
        public array $invitees_id = [],
    ) {}
}
