<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Table;

use App\Dto\Admin\Table\TableShowDto;
use App\Entity\Role;
use App\Entity\Table;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ShowTableController extends AbstractController
{
    #[Route(
        path: '/tables/{table_id}',
        name: 'api_admin_table_show',
        requirements: ['table_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a table', content: new OA\JsonContent(ref: new Model(type: TableShowDto::class)))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Table')]
    public function __invoke(#[MapEntity(id: 'table_id')] Table $table): JsonResponse
    {
        return $this->json(new TableShowDto($table));
    }
}
