<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\CardRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CardRepository::class)]
class Card
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $loginCode;

    #[ORM\OneToMany(mappedBy: 'card', targetEntity: Invitee::class)]
    private Collection $invitees;

    public function __construct(string $loginCode)
    {
        $this->invitees = new ArrayCollection();

        $this->loginCode = $loginCode;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLoginCode(): string
    {
        return $this->loginCode;
    }

    /**
     * @return Collection<int, Invitee>
     */
    public function getInvitees(): Collection
    {
        return $this->invitees;
    }

    public function addInvitee(Invitee $invitee): static
    {
        if (!$this->invitees->contains($invitee)) {
            $this->invitees->add($invitee);
            $invitee->setCard($this);
        }

        return $this;
    }

    public function removeInvitee(Invitee $invitee): static
    {
        if ($this->invitees->removeElement($invitee)) {
            // set the owning side to null (unless already changed)
            if ($invitee->getCard() === $this) {
                $invitee->setCard(null);
            }
        }

        return $this;
    }
}
