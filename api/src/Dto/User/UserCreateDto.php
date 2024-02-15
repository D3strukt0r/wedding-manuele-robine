<?php declare(strict_types=1);

namespace App\Dto\User;

use App\Entity\Food;
use Symfony\Component\Validator\Constraints as Assert;

readonly class UserCreateDto
{
    public function __construct(
        #[Assert\NotNull]
        public string $username,

        public ?string $password,

        /**
         * @var array<string>
         */
        public array $roles = [],
    ) {}
}
