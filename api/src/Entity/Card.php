<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\CardRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Hidehalo\Nanoid\Client;

#[ORM\Entity(repositoryClass: CardRepository::class)]
class Card
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToMany(mappedBy: 'card', targetEntity: Invitee::class)]
    private Collection $invitees;

    #[ORM\OneToOne(inversedBy: 'card', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $userLogin = null;

    public function __construct()
    {
        $this->invitees = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getUserLogin(): ?User
    {
        return $this->userLogin;
    }

    public function setUserLogin(?User $userLogin): void
    {
        $this->userLogin = $userLogin;
    }
}
