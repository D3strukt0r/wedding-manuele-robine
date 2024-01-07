<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Invitee;

use App\Entity\Invitee;
use App\Repository\InviteeRepository;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ListInviteeController extends AbstractController
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
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Tag('Admin/Invitee')]
    public function __invoke(): JsonResponse
    {
        return $this->json(array_map(static fn (Invitee $invitee) => [
            'id' => $invitee->getId(),
            'firstname' => $invitee->getFirstname(),
            'lastname' => $invitee->getLastname(),
            'email' => $invitee->getEmail(),
            'will_come' => $invitee->willCome(),
            'food' => $invitee->getFood(),
            'allergies' => $invitee->getAllergies(),
            'table_id' => $invitee->getTable()?->getId(),
            'card_id' => $invitee->getCard()?->getId(),
        ], $this->inviteeRepository->findAll()));
    }
}
