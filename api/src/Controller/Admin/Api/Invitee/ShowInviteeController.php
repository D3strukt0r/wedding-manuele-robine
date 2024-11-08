<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Invitee;

use App\Dto\Admin\Invitee\InviteeShowDto;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Service\PermissionChecker;
use Nelmio\ApiDocBundle\Attribute\Model;
use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ShowInviteeController extends AbstractController
{
    public function __construct(
        private readonly PermissionChecker $permissionChecker,
    ) {}

    #[Route(
        path: '/invitees/{invitee_id}',
        name: 'api_admin_invitee_show',
        requirements: ['invitee_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns an invitee', content: new OA\JsonContent(ref: new Model(type: InviteeShowDto::class)))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Invitee')]
    public function __invoke(#[MapEntity(id: 'invitee_id')] Invitee $invitee): JsonResponse
    {
        $actions = ($this->permissionChecker)([
            'update' => ['api_admin_invitee_update', ['invitee_id' => $invitee->getId()]],
            'delete' => ['api_admin_invitee_delete', ['invitee_id' => $invitee->getId()]],
        ]);

        return $this->json(new InviteeShowDto($invitee, $actions));
    }
}
