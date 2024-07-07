<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Invitee;

use App\Dto\Admin\Invitee\InviteeListDto;
use App\Dto\Common\ListQueryDto;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Repository\InviteeRepository;
use App\Service\PermissionChecker;
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
        private readonly PermissionChecker $permissionChecker,
    ) {}

    #[Route(
        path: '/invitees',
        name: 'api_admin_invitee_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
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
    public function __invoke(#[MapQueryString] ListQueryDto $query = new ListQueryDto()): JsonResponse
    {
        $invitees = $this->inviteeRepository->findBy([], [], $query->limit, $query->offset);

        return $this->json([
            'total' => $this->inviteeRepository->count([]),
            'offset' => $query->offset,
            'limit' => $query->limit,
            'records' => array_map(function (Invitee $invitee) {
                $actions = ($this->permissionChecker)([
                    'update' => ['api_admin_invitee_update', ['invitee_id' => $invitee->getId()]],
                    'delete' => ['api_admin_invitee_delete', ['invitee_id' => $invitee->getId()]],
                ]);

                return new InviteeListDto($invitee, $actions);
            }, $invitees),
        ]);
    }
}
