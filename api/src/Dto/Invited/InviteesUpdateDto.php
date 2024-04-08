<?php declare(strict_types=1);

namespace App\Dto\Invited;

use App\Validator\Invited\HasOnlyUnchangedInviteesFromOwnCard;
use Symfony\Component\Validator\Constraints as Assert;

readonly class InviteesUpdateDto
{
    public function __construct(
        /** @var array<int, InviteeUpdateDto> $invitees */
        #[Assert\Valid]
        #[HasOnlyUnchangedInviteesFromOwnCard]
        public array $invitees = [],
    ) {}
}
