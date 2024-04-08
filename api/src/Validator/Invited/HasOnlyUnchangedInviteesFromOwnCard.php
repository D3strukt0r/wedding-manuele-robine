<?php

namespace App\Validator\Invited;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class HasOnlyUnchangedInviteesFromOwnCard extends Constraint
{}
