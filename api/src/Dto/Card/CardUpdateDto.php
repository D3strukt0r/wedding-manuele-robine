<?php declare(strict_types=1);

namespace App\Dto\Card;

use Symfony\Component\Validator\Constraints as Assert;
use OpenApi\Attributes as OA;

readonly class CardUpdateDto
{
    public function __construct(
        /** @var array<int> */
        #[Assert\NotNull]
        public array $inviteeIds = [],

        #[OA\Property(example: 1)]
        public ?int $userLoginId,
    ) {}
}
