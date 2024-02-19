<?php declare(strict_types=1);

namespace App\Dto\Admin\User;

use App\Entity\User;

readonly class UserListDto
{
    public int $id;

    public string $username;

    /**
     * @var array<string>
     */
    public array $roles;

    public function __construct(User $user)
    {
        $this->id = $user->getId();
        $this->username = $user->getUsername();
        $this->roles = $user->getRoles();
    }
}
