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

    /**
     * @var array<string, bool>
     */
    public array $actions;

    /**
     * @param null|array<string, bool> $actions
     *
     * @throws \InvalidArgumentException
     */
    public function __construct(User $user, ?string $plainPassword = null, ?array $actions = null)
    {
        $id = $user->getId();
        if ($id === null) {
            throw new \InvalidArgumentException('User ID cannot be null, entity was not persisted yet.');
        }

        $this->id = $id;
        $this->username = $user->getUsername();
        $this->plainPassword = $plainPassword;
        $this->roles = $user->getRoles();
        $this->actions = $actions ?? [];
    }
}
