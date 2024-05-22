<?php declare(strict_types=1);

namespace App\Dto\Common;

use App\Entity\Food;
use App\Entity\Role;

enum ListableType: string
{
    case FOOD = 'food';
    case ROLE = 'role';

    public function getListClass(): string
    {
        return match ($this) {
            self::FOOD => Food::class,
            self::ROLE => Role::class,
        };
    }
}
