<?php declare(strict_types=1);

namespace App\Controller\Api\Table;

use App\Entity\Invitee;
use App\Entity\Table;
use App\Repository\TableRepository;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ListTableController extends AbstractController
{
    public function __construct(
        private readonly TableRepository $tableRepository,
    ) {}

    #[Route(
        path: '/table',
        name: 'api_table_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Tag('Table')]
    public function __invoke(): JsonResponse
    {
        return $this->json(array_map(static fn (Table $table) => [
            'id' => $table->getId(),
            'seats' => $table->getSeats(),
            'invitees_id' => $table->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ], $this->tableRepository->findAll()));
    }
}
