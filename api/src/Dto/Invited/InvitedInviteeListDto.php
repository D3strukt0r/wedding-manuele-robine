<?php declare(strict_types=1);

namespace App\Dto\Invited;

use App\Entity\Food;
use App\Entity\Invitee;

readonly class InvitedInviteeListDto
{
    public int $id;

    public string $firstname;

    public string $lastname;

    public ?string $email;

    public ?bool $willCome;

    public ?Food $food;

    public ?string $allergies;

    public ?int $tableId;

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
    }
}
