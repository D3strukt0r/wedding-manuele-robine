<?php declare(strict_types=1);

namespace App\Entity;

enum Food: string
{
    case MEAT = 'meat';
    // case FISH = 'fish';
    case VEGETARIAN = 'vegetarian';
    // case VEGAN = 'vegan';
    case CHILD = 'child';
}
