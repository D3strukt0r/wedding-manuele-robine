<?php declare(strict_types=1);

namespace App\Entity;

use App\Dto\Admin\Table\UpdateTableDto;
use App\Repository\TableRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TableRepository::class)]
#[ORM\Table(name: '`table`')]
class Table
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(unique: true)]
    private string $name;

    #[ORM\Column]
    private int $seats;

    /** @var Collection<int, Invitee> */
    #[ORM\OneToMany(mappedBy: 'table', targetEntity: Invitee::class)]
    private Collection $invitees;

    public function __construct(string $name, int $seats)
    {
        $this->name = $name;
        $this->seats = $seats;
        $this->invitees = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getSeats(): int
    {
        return $this->seats;
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
            $invitee->setTable($this);
        }

        return $this;
    }

    public function removeInvitee(Invitee $invitee): static
    {
        if ($this->invitees->removeElement($invitee)) {
            // set the owning side to null (unless already changed)
            if ($invitee->getTable() === $this) {
                $invitee->setTable(null);
            }
        }

        return $this;
    }

    public function update(UpdateTableDto $dto): void
    {
        $this->name = $dto->name;
        $this->seats = $dto->seats;
    }
}
