<?php declare(strict_types=1);

namespace App\Dto\Admin\Card;

use App\Entity\Card;
use App\Entity\Invitee;

readonly class CardListDto
{
    public int $id;

    public ?int $userLoginId;

    /** @var array<int> */
    public array $inviteeIds;

    /**
     * @var array<string, bool>
     */
    public array $actions;

    /**
     * @param array<string, bool>|null $actions
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(Card $card, ?array $actions = null)
    {
        $id = $card->getId();
        if ($id === null) {
            throw new \InvalidArgumentException('Card ID cannot be null, entity was not persisted yet.');
        }

        $this->id = $id;
        $this->userLoginId = $card->getUserLogin()?->getId();
        $this->inviteeIds = $card->getInvitees()->map(function (Invitee $invitee) {
            $id = $invitee->getId();
            if ($id === null) {
                throw new \InvalidArgumentException('Invitee ID cannot be null, entity was not persisted yet.');
            }
            return $id;
        })->toArray();
        $this->actions = $actions ?? [];
    }
}
