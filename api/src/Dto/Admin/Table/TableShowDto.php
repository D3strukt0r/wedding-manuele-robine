<?php declare(strict_types=1);

namespace App\Dto\Admin\Table;

use App\Entity\Invitee;
use App\Entity\Table;

readonly class TableShowDto
{
    public int $id;

    public string $name;

    public int $seats;

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
    public function __construct(Table $table, ?array $actions = null)
    {
        $id = $table->getId();
        if ($id === null) {
            throw new \InvalidArgumentException('Table ID cannot be null, entity was not persisted yet.');
        }

        $this->id = $id;
        $this->name = $table->getName();
        $this->seats = $table->getSeats();
        $this->inviteeIds = $table->getInvitees()->map(function (Invitee $invitee) {
            $id = $invitee->getId();
            if ($id === null) {
                throw new \InvalidArgumentException('Invitee ID cannot be null, entity was not persisted yet.');
            }
            return $id;
        })->toArray();
        $this->actions = $actions ?? [];
    }
}
