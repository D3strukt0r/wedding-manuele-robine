<?php declare(strict_types=1);

namespace App\Controller\Api\Invitee;

use App\Entity\Invitee;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ShowInviteeController extends AbstractController
{
    #[Route(
        path: '/invitees/{invitee_id}',
        name: 'api_invitee_show',
        requirements: ['invitee_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Tag('Invitee')]
    public function __invoke(#[MapEntity(id: 'invitee_id')] Invitee $invitee): JsonResponse
    {
        return $this->json([
            'id' => $invitee->getId(),
            'firstname' => $invitee->getFirstname(),
            'lastname' => $invitee->getLastname(),
            'email' => $invitee->getEmail(),
            'will_come' => $invitee->willCome(),
            'food' => $invitee->getFood(),
            'allergies' => $invitee->getAllergies(),
            'table_id' => $invitee->getTable()?->getId(),
            'card_id' => $invitee->getCard()?->getId(),
        ]);
    }
}
