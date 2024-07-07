<?php declare(strict_types=1);

namespace App\Dto\Common;

/**
 * @template TEnumType of string|int
 */
trait EnumToArrayTrait
{
    /**
     * @return array<string>
     */
    public static function names(): array
    {
        return array_column(self::cases(), 'name');
    }

    /**
     * @return array<TEnumType>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * @return array<string, TEnumType>
     */
    public static function array(): array
    {
        return array_combine(self::values(), self::names());
    }
}
