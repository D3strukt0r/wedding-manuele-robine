<?php declare(strict_types=1);

namespace App\Dto\Admin\User;

use App\Entity\Role;
use Symfony\Component\Validator\Constraints as Assert;

readonly class UserUpdateDto
{
    public function __construct(
        #[Assert\NotNull]
        #[Assert\Length(max: 180)]
        public string $username,

        public ?string $newPassword,

        /**
         * @var array<Role>
         */
        public array $roles = [],
    ) {}
}
