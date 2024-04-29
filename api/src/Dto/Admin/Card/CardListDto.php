<?php declare(strict_types=1);

namespace App\Dto\Admin\Card;

use App\Entity\Card;
use App\Entity\Invitee;

readonly class CardListDto
{
    public ?int $id;

    public ?int $userLoginId;

    /** @var array<?int> */
    public array $inviteeIds;

    /**
     * @var array<string, bool>
     */
    public array $actions;

    /**
     * @param array<string, bool>|null $actions
     */
    public function __construct(Card $card, ?array $actions = null)
    {
        $this->id = $card->getId();
        $this->userLoginId = $card->getUserLogin()?->getId();
        $this->inviteeIds = $card->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray();
        $this->actions = $actions ?? [];
    }
}
