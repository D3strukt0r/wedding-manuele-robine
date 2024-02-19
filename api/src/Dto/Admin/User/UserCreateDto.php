<?php declare(strict_types=1);

namespace App\Dto\Admin\User;

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
