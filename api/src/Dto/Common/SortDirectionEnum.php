<?php declare(strict_types=1);

namespace App\Dto\Common;

enum SortDirectionEnum: string
{
    /** @use EnumToArrayTrait<string> */
    use EnumToArrayTrait;

    case ASC = 'asc';
    case DESC = 'desc';
}
