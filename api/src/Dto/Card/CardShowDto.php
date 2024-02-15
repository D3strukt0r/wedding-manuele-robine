<?php declare(strict_types=1);

namespace App\Dto\Card;

use App\Entity\Card;
use App\Entity\Invitee;

readonly class CardShowDto
{
    public int $id;

    public ?int $userLoginId;

    /** @var array<int> */
    public array $inviteeIds;

    public function __construct(Card $card)
    {
        $this->id = $card->getId();
        $this->userLoginId = $card->getUserLogin()?->getId();
        $this->inviteeIds = $card->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray();
    }
}
