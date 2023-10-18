<?php declare(strict_types=1);

namespace App\Controller\Api\Table;

use App\Entity\Invitee;
use App\Entity\Table;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ShowTableController extends AbstractController
{
    #[Route(
        path: '/tables/{table_id}',
        name: 'api_table_show',
        requirements: ['table_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Tag('Table')]
    public function __invoke(#[MapEntity(id: 'table_id')] Table $table): JsonResponse
    {
        return $this->json([
            'id' => $table->getId(),
            'seats' => $table->getSeats(),
            'invitees_id' => $table->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ]);
    }
}
