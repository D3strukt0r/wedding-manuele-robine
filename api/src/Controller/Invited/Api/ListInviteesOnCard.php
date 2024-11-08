<?php declare(strict_types=1);

namespace App\Controller\Invited\Api;

use App\Dto\Invited\InvitedInviteeListDto;
use App\Dto\Invited\InvitedInviteeQueryDto;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Entity\User;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use Nelmio\ApiDocBundle\Attribute\Model;
use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ListInviteesOnCard extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
        private readonly CardRepository $cardRepository,
    ) {}

    #[Route(
        path: '/invitees',
        name: 'api_invited_invitee_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::USER->value)]
    #[Security(name: 'Bearer')]
    #[OA\Parameter(name: 'limit', description: 'The field used to limit the number of records returned', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'offset', description: 'The field used to offset the records returned', in: 'query', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a list of invitees', content: new OA\JsonContent(properties: [
        new OA\Property(property: 'total', type: 'integer'),
        new OA\Property(property: 'offset', type: 'integer'),
        new OA\Property(property: 'limit', type: 'integer'),
        new OA\Property(property: 'records', type: 'array', items: new OA\Items(
            ref: new Model(type: InvitedInviteeListDto::class)
        )),
    ]))]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Invited/Invitee')]
    public function __invoke(
        #[CurrentUser] User $currentUser,
        #[MapQueryString] InvitedInviteeQueryDto $query = new InvitedInviteeQueryDto(),
    ): JsonResponse {
        $card = $this->cardRepository->findOneBy(['userLogin' => $currentUser]);
        if ($card !== null) {
            $invitees = $this->inviteeRepository->findBy(['card' => $card], [], $query->limit, $query->offset);
        } else {
            $invitees = [];
        }

        return $this->json([
            'total' => $card !== null ? $this->inviteeRepository->count(['card' => $card]) : 0,
            'offset' => $query->offset,
            'limit' => $query->limit,
            'records' => array_map(static fn (Invitee $invitee) => new InvitedInviteeListDto($invitee), $invitees),
        ]);
    }
}
