<?php declare(strict_types=1);

namespace App\Controller\Api\Table;

use App\Entity\Table;
use App\Repository\TableRepository;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DeleteTableController extends AbstractController
{
    public function __construct(
        private readonly TableRepository $tableRepository,
    ) {}

    #[Route(
        path: '/table/{table_id}',
        name: 'api_table_delete',
        requirements: ['table_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_DELETE],
    )]
    #[OA\Response(response: Response::HTTP_NO_CONTENT, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Tag('Table')]
    public function __invoke(#[MapEntity(id: 'table_id')] Table $table): JsonResponse
    {
        $this->tableRepository->remove($table, true);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
