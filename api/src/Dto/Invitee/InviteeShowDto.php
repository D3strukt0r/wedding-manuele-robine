<?php declare(strict_types=1);

namespace App\Dto\Invitee;

use App\Entity\Food;
use App\Entity\Invitee;

readonly class InviteeShowDto
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

    public function __construct(Invitee $invitee)
    {
        $this->id = $invitee->getId();
        $this->firstname = $invitee->getFirstname();
        $this->lastname = $invitee->getLastname();
        $this->email = $invitee->getEmail();
        $this->willCome = $invitee->willCome();
        $this->food = $invitee->getFood();
        $this->allergies = $invitee->getAllergies();
        $this->tableId = $invitee->getTable()?->getId();
        $this->cardId = $invitee->getCard()?->getId();
    }
}
