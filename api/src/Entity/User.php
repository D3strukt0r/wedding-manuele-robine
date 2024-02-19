<?php declare(strict_types=1);

namespace App\Entity;

use App\Dto\Admin\User\UserUpdateDto;
use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true, nullable: false)]
    private string $username;

    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column(nullable: false)]
    private string $password;

    #[ORM\OneToOne(mappedBy: 'userLogin', cascade: ['persist', 'remove'])]
    private ?Card $card = null;

    public function __construct(string $username, UserPasswordHasherInterface $passwordHasher, string $password)
    {
        $this->username = $username;
        $this->password = $passwordHasher->hashPassword($this, $password);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return $this->getUsername();
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = Role::USER->value;

        return array_unique($roles);
    }

    /**
     * @param array<Role> $roles
     */
    public function setRoles(array $roles): void
    {
        $this->roles = array_map(static fn(Role $role) => $role->value, $roles);
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function update(UserUpdateDto $dto, ?UserPasswordHasherInterface $passwordHasher = null): void
    {
        $this->username = $dto->username;
        if ($passwordHasher && $dto->newPassword) {
            $this->password = $passwordHasher->hashPassword($this, $dto->newPassword);
        }
        $this->setRoles($dto->roles);
    }

    public function getCard(): ?Card
    {
        return $this->card;
    }

    public function setCard(Card $card): static
    {
        // set the owning side of the relation if necessary
        if ($card->getUserLogin() !== $this) {
            $card->setUserLogin($this);
        }

        $this->card = $card;

        return $this;
    }
}
