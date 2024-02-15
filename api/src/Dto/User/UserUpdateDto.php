<?php declare(strict_types=1);

namespace App\Dto\User;

use App\Entity\Food;
use App\Entity\Role;
use Symfony\Component\Validator\Constraints as Assert;

readonly class UserUpdateDto
{
    public function __construct(
        #[Assert\NotNull]
        public string $username,

        public ?string $newPassword,

        /**
         * @var array<Role>
         */
        public array $roles = [],
    ) {}
}
