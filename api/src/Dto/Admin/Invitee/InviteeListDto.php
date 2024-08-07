<?php declare(strict_types=1);

namespace App\Dto\Admin\Invitee;

use App\Entity\Food;
use App\Entity\Invitee;

readonly class InviteeListDto
{
    public int $id;

    public string $firstname;

    public string $lastname;

    public ?string $email;

    public ?bool $willCome;

    public ?Food $food;

    public ?string $allergies;

    public ?int $tableId;

    public ?int $cardId;

    /**
     * @var array<string, bool>
     */
    public array $actions;

    /**
     * @param null|array<string, bool> $actions
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(Invitee $invitee, ?array $actions = null)
    {
        $id = $invitee->getId();
        if ($id === null) {
            throw new \InvalidArgumentException('Invitee ID cannot be null, entity was not persisted yet.');
        }

        $this->id = $id;
        $this->firstname = $invitee->getFirstName();
        $this->lastname = $invitee->getLastName();
        $this->email = $invitee->getEmail();
        $this->willCome = $invitee->willCome();
        $this->food = $invitee->getFood();
        $this->allergies = $invitee->getAllergies();
        $this->tableId = $invitee->getTable()?->getId();
        $this->cardId = $invitee->getCard()?->getId();
        $this->actions = $actions ?? [];
    }
}
