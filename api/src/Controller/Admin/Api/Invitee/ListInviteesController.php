<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Invitee;

use App\Dto\Admin\Invitee\InviteeListDto;
use App\Dto\Admin\Invitee\InviteesQueryDto;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Repository\InviteeRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ListInviteesController extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/invitees',
        name: 'api_admin_invitee_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Parameter(name: 'limit', in: 'query', description: 'The field used to limit the number of records returned', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'offset', in: 'query', description: 'The field used to offset the records returned', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a list of invitees', content: new OA\JsonContent(properties: [
        new OA\Property(property: 'total', type: 'integer'),
        new OA\Property(property: 'offset', type: 'integer'),
        new OA\Property(property: 'limit', type: 'integer'),
        new OA\Property(property: 'records', type: 'array', items: new OA\Items(
            ref: new Model(type: InviteeListDto::class)
        )),
    ]))]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Invitee')]
    public function __invoke(#[MapQueryString] InviteesQueryDto $query = new InviteesQueryDto()): JsonResponse
    {
        $invitees = $this->inviteeRepository->findBy([], [], $query->limit, $query->offset);
        return $this->json([
            'total' => $this->inviteeRepository->count([]),
            'offset' => $query->offset,
            'limit' => $query->limit,
            'records' => array_map(static fn (Invitee $invitee) => new InviteeListDto($invitee), $invitees),
        ]);
    }
}
