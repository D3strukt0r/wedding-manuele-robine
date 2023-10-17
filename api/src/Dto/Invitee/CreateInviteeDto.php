<?php declare(strict_types=1);

namespace App\Dto\Invitee;

use App\Entity\Card;
use App\Entity\Food;
use App\Entity\Table;
use Symfony\Component\Validator\Constraints as Assert;

readonly class CreateInviteeDto
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

        public ?Table $table,

        public ?Card $card,
    ) {}
}
