<?php declare(strict_types=1);

namespace App\Dto\Admin\Table;

use App\Entity\Invitee;
use App\Entity\Table;

readonly class TableShowDto
{
    public int $id;

    public int $seats;

    /** @var array<int> */
    public array $inviteeIds;

    /**
     * @var array<string, bool>
     */
    public array $actions;

    public function __construct(Table $table, ?array $actions = null)
    {
        $this->id = $table->getId();
        $this->seats = $table->getSeats();
        $this->inviteeIds = $table->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray();
        $this->actions = $actions ?? [];
    }
}
