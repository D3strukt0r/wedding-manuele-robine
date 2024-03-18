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

    /**
     * @var array<string, bool>
     */
    public array $actions;

    public function __construct(User $user, ?array $actions = null)
    {
        $this->id = $user->getId();
        $this->username = $user->getUsername();
        $this->roles = $user->getRoles();
        $this->actions = $actions ?? [];
    }
}
