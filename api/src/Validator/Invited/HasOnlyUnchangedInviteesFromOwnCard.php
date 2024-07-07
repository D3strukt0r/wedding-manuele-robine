<?php declare(strict_types=1);

namespace App\Validator\Invited;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class HasOnlyUnchangedInviteesFromOwnCard extends Constraint {}
