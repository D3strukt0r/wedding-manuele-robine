<?php declare(strict_types=1);

namespace App\Dto\Admin\Card;

use OpenApi\Attributes as OA;
use Symfony\Component\Validator\Constraints as Assert;

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
