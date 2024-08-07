<?php declare(strict_types=1);

namespace App\Dto\Admin\Card;

use OpenApi\Attributes as OA;

readonly class UpdateCardDto
{
    public function __construct(
        #[OA\Property(example: 1)]
        public ?int $userLoginId,

        /** @var array<int> */
        #[OA\Property(example: [1, 2])]
        public array $inviteeIds = [],
    ) {}
}
