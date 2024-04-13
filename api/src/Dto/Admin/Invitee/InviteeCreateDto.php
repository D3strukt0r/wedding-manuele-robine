<?php declare(strict_types=1);

namespace App\Dto\Admin\Invitee;

use App\Entity\Food;
use OpenApi\Attributes as OA;
use Symfony\Component\Validator\Constraints as Assert;

readonly class InviteeCreateDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 255)]
        #[OA\Property(example: 'Max')]
        public string $firstname,

        #[Assert\NotBlank]
        #[Assert\Length(max: 255)]
        #[OA\Property(example: 'Mustermann')]
        public string $lastname,

        #[Assert\NotBlank(allowNull: true)]
        #[Assert\Length(max: 255)]
        #[Assert\Email(mode: Assert\Email::VALIDATION_MODE_STRICT)]
        #[OA\Property(format: 'email', example: 'max@mustermann.com')]
        public ?string $email,

        #[OA\Property(example: true)]
        public ?bool $willCome,

        #[OA\Property(example: Food::MEAT)]
        public ?Food $food,

        #[Assert\NotBlank(allowNull: true)]
        #[Assert\Length(max: 255)]
        #[OA\Property(example: 'Gluten, etc.')]
        public ?string $allergies,

        #[OA\Property(example: 1)]
        public ?int $tableId,

        #[OA\Property(example: 1)]
        public ?int $cardId,
    ) {}
}
