<?php declare(strict_types=1);

namespace App\Dto\User;

use App\Entity\Food;
use Symfony\Component\Validator\Constraints as Assert;

readonly class UpdateUserDto
{
    public function __construct(
        #[Assert\NotNull]
        public string $username,

        public ?string $newPassword,

        public array $roles = [],
    ) {}
}
