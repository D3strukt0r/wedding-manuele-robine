<?php declare(strict_types=1);

namespace App\Controller\Api\Invitee;

use App\Entity\Invitee;
use App\Repository\InviteeRepository;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DeleteInviteeController extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/invitee/{invitee_id}',
        name: 'api_invitee_delete',
        requirements: ['invitee_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_DELETE],
    )]
    #[OA\Response(response: Response::HTTP_NO_CONTENT, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Tag('Invitee')]
    public function __invoke(#[MapEntity(id: 'invitee_id')] Invitee $invitee): JsonResponse
    {
        $this->inviteeRepository->remove($invitee, true);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
