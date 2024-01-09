<?php declare(strict_types=1);

namespace App\Dto\Card;

use Symfony\Component\Validator\Constraints as Assert;
use OpenApi\Attributes as OA;

readonly class UpdateCardDto
{
    public function __construct(
        /** @var array<int> */
        #[Assert\NotNull]
        public array $invitees_id = [],

        #[OA\Property(example: 1)]
        public ?int $userLoginId,
    ) {}
}
