<?php declare(strict_types=1);

namespace App\Entity;

use App\Dto\Admin\User\CreateUserDto;
use App\Dto\Admin\User\UpdateUserDto;
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

    #[ORM\Column(length: 180, unique: true)]
    private string $username;

    /** @var array<string> */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private string $password;

    #[ORM\OneToOne(mappedBy: 'userLogin', cascade: ['persist'])]
    private ?Card $card = null;

    #[ORM\OneToOne(mappedBy: 'user', cascade: ['persist', 'remove'])]
    private ?Gallery $gallery = null;

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
        $this->roles = array_map(static fn (Role $role) => $role->value, $roles);
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

    public static function create(CreateUserDto $dto, UserPasswordHasherInterface $passwordHasher, string $plainPassword): self
    {
        $entity = new self(
            $dto->username,
            $passwordHasher,
            $plainPassword,
        );
        $entity->setRoles($dto->roles);

        return $entity;
    }

    public function update(UpdateUserDto $dto, ?UserPasswordHasherInterface $passwordHasher = null): void
    {
        $this->username = $dto->username;
        if ($passwordHasher !== null && $dto->newPassword !== null) {
            $this->password = $passwordHasher->hashPassword($this, $dto->newPassword);
        }
        $this->setRoles($dto->roles);
    }

    public function getGallery(): ?Gallery
    {
        return $this->gallery;
    }

    public function setGallery(Gallery $gallery): static
    {
        // set the owning side of the relation if necessary
        // if ($gallery->getUser() !== $this) {
        //     $gallery->setUser($this);
        // }

        $this->gallery = $gallery;

        return $this;
    }
}
