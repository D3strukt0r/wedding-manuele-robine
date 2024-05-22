<?php declare(strict_types=1);

namespace App\Validator\Invited;

use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class HasOnlyUnchangedInviteesFromOwnCardValidator extends ConstraintValidator
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
        private readonly CardRepository $cardRepository,
        private readonly Security $security,
    ) {}

    public function validate(mixed $value, Constraint $constraint): void
    {
        if (!$constraint instanceof HasOnlyUnchangedInviteesFromOwnCard) {
            throw new UnexpectedTypeException($constraint, HasOnlyUnchangedInviteesFromOwnCard::class);
        }

        // custom constraints should ignore null and empty values to allow
        // other constraints (NotBlank, NotNull, etc.) to take care of that
        if ($value === null || $value === '') {
            return;
        }

        if (!\is_array($value)) {
            throw new UnexpectedValueException($value, 'array');
        }

        $currentUser = $this->security->getUser();
        if ($currentUser === null) {
            return;
        }

        $card = $this->cardRepository->findOneBy(['userLogin' => $currentUser]);
        if ($card === null) {
            $this->context->buildViolation('invited.noCardFound')->addViolation();

            return;
        }

        $invitees = $this->inviteeRepository->findBy(['card' => $card]);
        $inviteeIds = array_map(static fn ($invitee) => $invitee->getId(), $invitees);

        // Check if we added any new invitees using array functions
        foreach (array_keys($value) as $inviteeId) {
            if (!\in_array($inviteeId, $inviteeIds, true)) {
                $this->context->buildViolation('invited.hasChangedInviteesList')->addViolation();

                return;
            }
        }

        // Check if we removed any invitees using array functions
        foreach ($inviteeIds as $inviteeId) {
            if (!\array_key_exists($inviteeId, $value)) {
                $this->context->buildViolation('invited.hasChangedInviteesList')->addViolation();

                return;
            }
        }
    }
}
