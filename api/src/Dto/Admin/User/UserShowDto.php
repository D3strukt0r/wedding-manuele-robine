<?php declare(strict_types=1);

namespace App\Dto\Admin\User;

use App\Entity\User;

readonly class UserShowDto
{
    public int $id;

    public string $username;

    public ?string $plainPassword;

    /**
     * @var array<string>
     */
    public array $roles;

    public function __construct(User $user, ?string $plainPassword = null)
    {
        $this->id = $user->getId();
        $this->username = $user->getUsername();
        $this->plainPassword = $plainPassword;
        $this->roles = $user->getRoles();
    }
}
