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

            // 'Query2' => [
            //     self::RESOLVE_FIELD => function ($value, ArgumentInterface $args, \ArrayObject $context, ResolveInfo $info) {
            //         if ('baz' === $info->fieldName) {
            //             $id = (int) $args['id'];
            //
            //             return findBaz('baz', $id);
            //         }
            //
            //         return null;
            //     },
            //     'bar' => [Bar::class, 'getBar'],
            // ],
            // 'Foo' => [
            //     self::RESOLVE_TYPE => function ($value) {
            //         return isset($value['user']) ? 'Bar' : null;
            //     },
            // ],
            // enum internal values
            // 'User' => [
            //     'TATA' => 1,
            //     'TITI' => 2,
            //     'TOTO' => 3,
            // ],
            // custom scalar
            // 'Baz' => [
            //     self::SERIALIZE => function ($value) {
            //         return sprintf('%s Formatted Baz', $value);
            //     },
            //     self::PARSE_VALUE => function ($value) {
            //         if (!is_string($value)) {
            //             throw new Error(sprintf('Cannot represent following value as a valid Baz: %s.', Utils::printSafeJson($value)));
            //         }
            //
            //         return str_replace(' Formatted Baz', '', $value);
            //     },
            //     self::PARSE_LITERAL => function ($valueNode) {
            //         if (!$valueNode instanceof StringValueNode) {
            //             throw new Error('Query error: Can only parse strings got: '.$valueNode->kind, [$valueNode]);
            //         }
            //
            //         return str_replace(' Formatted Baz', '', $valueNode->value);
            //     },
            // ],
            // or reuse an existing scalar (note: description and name will be override by decorator)
            //'Baz' => [self::SCALAR_TYPE => function () { return new FooScalarType(); }],
        ];
    }
}
