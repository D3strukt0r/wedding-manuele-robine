<?php declare(strict_types=1);

namespace App\Resolver;

use App\Entity\Card;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use App\Repository\TableRepository;
use GraphQL\Error\Error;
use GraphQL\Language\AST\StringValueNode;
use GraphQL\Type\Definition\ResolveInfo;
use Overblog\GraphQLBundle\Definition\ArgumentInterface;
use Overblog\GraphQLBundle\Resolver\ResolverMap;

class AppResolverMap extends ResolverMap
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly TableRepository $tableRepository,
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    protected function map(): array
    {
        return [
            'Query' => [self::RESOLVE_FIELD => function (mixed $value, ArgumentInterface $args, \ArrayObject $context, ResolveInfo $info) {
                return match ($info->fieldName) {
                    'card' => $this->cardRepository->find((int) $args['id']),
                    'cards' => $this->cardRepository->findAll(),

                    'table' => $this->tableRepository->find((int) $args['id']),
                    'tables' => $this->tableRepository->findAll(),

                    'invitee' => $this->inviteeRepository->find((int) $args['id']),
                    'invitees' => $this->inviteeRepository->findAll(),
                    // 'findInviteeByLastName' => $this->inviteeRepository->findBy(['lastName' => $args['lastName']]),
                    default => null
                };
            }],
            'Mutation' => [self::RESOLVE_FIELD => function (mixed $value, ArgumentInterface $args, \ArrayObject $context, ResolveInfo $info) {
                return match ($info->fieldName) {
                    // 'createCard' => Run command with $args['card'],
                    // 'updateCard' => Run command with (int)$args['id'], $args['card'],
                    default => null
                };
            }],
        ];
    }
}
