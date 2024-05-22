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

    /**
     * @param null|array<string, bool> $actions
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(User $user, ?array $actions = null)
    {
        $id = $user->getId();
        if ($id === null) {
            throw new \InvalidArgumentException('User ID cannot be null, entity was not persisted yet.');
        }

        $this->id = $id;
        $this->username = $user->getUsername();
        $this->roles = $user->getRoles();
        $this->actions = $actions ?? [];
    }
}
