<?php declare(strict_types=1);

namespace App\Dto\Admin\Table;

use App\Entity\Invitee;
use App\Entity\Table;

readonly class TableListDto
{
    public ?int $id;

    public string $name;

    public int $seats;

    /** @var array<?int> */
    public array $inviteeIds;

    /**
     * @var array<string, bool>
     */
    public array $actions;

    /**
     * @param array<string, bool>|null $actions
     */
    public function __construct(Table $table, ?array $actions = null)
    {
        $this->id = $table->getId();
        $this->name = $table->getName();
        $this->seats = $table->getSeats();
        $this->inviteeIds = $table->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray();
        $this->actions = $actions ?? [];
    }
}
