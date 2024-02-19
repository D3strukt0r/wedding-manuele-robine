<?php declare(strict_types=1);

namespace App\Dto\Card;

use Symfony\Component\Validator\Constraints as Assert;
use OpenApi\Attributes as OA;

readonly class CardCreateDto
{
    public function __construct(
        #[OA\Property(example: 1)]
        public ?int $userLoginId,

        /** @var array<int> */
        #[Assert\NotNull]
        public array $inviteeIds = [],
    ) {}
}
