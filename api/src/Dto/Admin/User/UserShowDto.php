<?php declare(strict_types=1);

namespace App\Dto\Admin\User;

use App\Entity\User;

readonly class UserShowDto
{
    public ?int $id;

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
     * @param array<string, bool>|null $actions
     */
    public function __construct(User $user, ?string $plainPassword = null, ?array $actions = null)
    {
        $this->id = $user->getId();
        $this->username = $user->getUsername();
        $this->plainPassword = $plainPassword;
        $this->roles = $user->getRoles();
        $this->actions = $actions ?? [];
    }
}
