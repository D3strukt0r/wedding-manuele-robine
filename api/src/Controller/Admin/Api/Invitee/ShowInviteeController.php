<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Invitee;

use App\Dto\Invitee\InviteeShowDto;
use App\Entity\Invitee;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ShowInviteeController extends AbstractController
{
    #[Route(
        path: '/invitees/{invitee_id}',
        name: 'api_admin_invitee_show',
        requirements: ['invitee_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns an invitee', content: new OA\JsonContent(ref: new Model(type: InviteeShowDto::class)))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Invitee')]
    public function __invoke(#[MapEntity(id: 'invitee_id')] Invitee $invitee): JsonResponse
    {
        return $this->json(new InviteeShowDto($invitee));
    }
}
