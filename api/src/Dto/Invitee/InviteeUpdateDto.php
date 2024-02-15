<?php declare(strict_types=1);

namespace App\Dto\Invitee;

use App\Entity\Food;
use Symfony\Component\Validator\Constraints as Assert;

readonly class InviteeUpdateDto
{
    public function __construct(
        #[Assert\NotNull]
        public string $firstname,

        #[Assert\NotNull]
        public string $lastname,

        public ?string $email,

        public ?bool $willCome,

        public ?Food $food,

        public ?string $allergies,

        public ?int $tableId,

        public ?int $cardId,
    ) {}
}
