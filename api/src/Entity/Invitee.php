<?php declare(strict_types=1);

namespace App\Entity;

use App\Dto\Admin\Invitee\CreateInviteeDto;
use App\Dto\Admin\Invitee\UpdateInviteeDto;
use App\Dto\Invited\InviteeUpdateDto as MyInviteeUpdateDto;
use App\Repository\InviteeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: InviteeRepository::class)]
class Invitee
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $firstname;

    #[ORM\Column(length: 255)]
    private string $lastname;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $email = null;

    #[ORM\Column(nullable: true)]
    private ?bool $willCome = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?Food $food = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $allergies = null;

    #[ORM\ManyToOne(inversedBy: 'invitees')]
    #[ORM\JoinColumn(name: 'table_to_sit_id', onDelete: 'SET NULL')]
    private ?Table $table = null;

    #[ORM\ManyToOne(inversedBy: 'invitees')]
    #[ORM\JoinColumn(onDelete: 'SET NULL')]
    private ?Card $card = null;

    public function __construct(string $firstname, string $lastname)
    {
        $this->firstname = $firstname;
        $this->lastname = $lastname;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): string
    {
        return $this->firstname;
    }

    public function getLastname(): string
    {
        return $this->lastname;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function willCome(): ?bool
    {
        return $this->willCome;
    }

    public function getFood(): ?Food
    {
        return $this->food;
    }

    public function getAllergies(): ?string
    {
        return $this->allergies;
    }

    public function getTable(): ?Table
    {
        return $this->table;
    }

    public function setTable(?Table $table): static
    {
        $this->table = $table;

        return $this;
    }

    public function getCard(): ?Card
    {
        return $this->card;
    }

    public function setCard(?Card $card): static
    {
        $this->card = $card;

        return $this;
    }

    public static function create(CreateInviteeDto $dto): self
    {
        $entity = new self(
            $dto->firstname,
            $dto->lastname,
        );
        $entity->email = $dto->email;
        $entity->willCome = $dto->willCome;
        $entity->food = $dto->food;
        $entity->allergies = $dto->allergies;

        return $entity;
    }

    public function update(UpdateInviteeDto|MyInviteeUpdateDto $dto): void
    {
        $this->firstname = $dto->firstname;
        $this->lastname = $dto->lastname;
        $this->email = $dto->email;
        $this->willCome = $dto->willCome;
        $this->food = $dto->food;
        $this->allergies = $dto->allergies;
    }
}
