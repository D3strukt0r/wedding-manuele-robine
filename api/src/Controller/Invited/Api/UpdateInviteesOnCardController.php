<?php declare(strict_types=1);

namespace App\Controller\Invited\Api;

use App\Dto\Invited\InvitedInviteeListDto;
use App\Dto\Invited\InviteesUpdateDto;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Entity\User;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UpdateInviteesOnCardController extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
        private readonly CardRepository $cardRepository,
    ) {}

    #[Route(
        path: '/invitees',
        name: 'api_invited_invitee_update',
        options: ['expose' => true],
        methods: [Request::METHOD_PATCH, Request::METHOD_PUT],
    )]
    #[IsGranted(Role::USER->value)]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: InviteesUpdateDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a list of invitees', content: new OA\JsonContent(properties: [
        new OA\Property(property: 'total', type: 'integer'),
        new OA\Property(property: 'offset', type: 'integer'),
        new OA\Property(property: 'limit', type: 'integer'),
        new OA\Property(property: 'records', type: 'array', items: new OA\Items(
            ref: new Model(type: InvitedInviteeListDto::class)
        )),
    ]))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Invited/Invitee')]
    public function __invoke(
        #[CurrentUser] User $currentUser,
        #[MapRequestPayload] InviteesUpdateDto $dto
    ): JsonResponse {
        foreach ($dto->invitees as $inviteeId => $inviteeDto) {
            $invitee = $this->inviteeRepository->find($inviteeId);
            if ($invitee === null) {
                throw $this->createNotFoundException(\sprintf('Invitee with ID %s not found', $inviteeId));
            }
            $invitee->update($inviteeDto);
            $this->inviteeRepository->save($invitee, true); // TODO: Batch handling
        }

        // TODO: How do we handle pagination?
        $limit = 500;
        $offset = 0;
        $card = $this->cardRepository->findOneBy(['userLogin' => $currentUser]);
        $invitees = $this->inviteeRepository->findBy(['card' => $card], [], $limit, $offset);

        return $this->json([
            'total' => $this->inviteeRepository->count(['card' => $card]),
            'offset' => $offset,
            'limit' => $limit,
            'records' => array_map(static fn (Invitee $invitee) => new InvitedInviteeListDto($invitee), $invitees),
        ]);
    }
}
