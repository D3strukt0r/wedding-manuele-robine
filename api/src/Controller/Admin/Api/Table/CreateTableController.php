<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Table;

use App\Dto\Admin\Table\TableCreateDto;
use App\Dto\Admin\Table\TableShowDto;
use App\Entity\Table;
use App\Repository\InviteeRepository;
use App\Repository\TableRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class CreateTableController extends AbstractController
{
    public function __construct(
        private readonly TableRepository $tableRepository,
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/tables',
        name: 'api_admin_table_create',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: TableCreateDto::class)))]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Returns a table', content: new OA\JsonContent(ref: new Model(type: TableShowDto::class)))]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Table')]
    public function __invoke(#[MapRequestPayload] TableCreateDto $dto): JsonResponse
    {
        $table = new Table($dto->seats);
        foreach ($dto->inviteeIds as $invitee) {
            $table->addInvitee($this->inviteeRepository->find($invitee));
        }
        $this->tableRepository->save($table, true);

        return $this->json(new TableShowDto($table), Response::HTTP_CREATED);
    }
}
