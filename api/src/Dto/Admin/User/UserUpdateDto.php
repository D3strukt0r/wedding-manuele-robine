<?php declare(strict_types=1);

namespace App\Dto\Admin\User;

use App\Entity\Role;
use OpenApi\Attributes as OA;
use Symfony\Component\Validator\Constraints as Assert;

readonly class UserUpdateDto
{
    public function __construct(
        #[Assert\NotBlank]
        #[Assert\Length(max: 180)]
        #[OA\Property(example: 'maxi1')]
        public string $username,

        #[Assert\NotBlank(allowNull: true)]
        #[OA\Property(example: 'secretPassword123')]
        public ?string $newPassword,

        /** @var array<Role> */
        #[OA\Property(example: [Role::USER, Role::ADMIN])]
        public array $roles = [],
    ) {}
}
