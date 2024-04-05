<?php declare(strict_types=1);

namespace App\Dto\Admin\Invitee;

use App\Entity\Food;
use Symfony\Component\Validator\Constraints as Assert;

readonly class InviteeUpdateDto
{
    public function __construct(
        #[Assert\NotNull]
        #[Assert\Length(max: 255)]
        public string $firstname,

        #[Assert\NotNull]
        #[Assert\Length(max: 255)]
        public string $lastname,

        #[Assert\Length(max: 255)]
        public ?string $email,

        public ?bool $willCome,

        public ?Food $food,

        #[Assert\Length(max: 255)]
        public ?string $allergies,

        public ?int $tableId,

        public ?int $cardId,
    ) {}
}
