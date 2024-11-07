<?php declare(strict_types=1);

namespace App\Dto\Admin\Dashboard;

readonly class DashboardShowDto
{
    /**
     * @param array<string, int>                                                                $foodChoices
     * @param array<array{inviteeId: int, name: non-falsy-string, allergies: non-empty-string}> $allergies
     */
    public function __construct(
        public array $foodChoices,
        public array $allergies,
    ) {}
}
