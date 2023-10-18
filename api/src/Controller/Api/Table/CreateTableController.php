<?php declare(strict_types=1);

namespace App\Controller\Api\Table;

use App\Dto\Table\CreateTableDto;
use App\Entity\Invitee;
use App\Entity\Table;
use App\Repository\InviteeRepository;
use App\Repository\TableRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

class CreateTableController extends AbstractController
{
    public function __construct(
        private readonly TableRepository $tableRepository,
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/tables',
        name: 'api_table_create',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: CreateTableDto::class)))]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Table')]
    public function __invoke(#[MapRequestPayload] CreateTableDto $dto): JsonResponse
    {
        $table = new Table($dto->seats);
        foreach ($dto->invitees as $invitee) {
            $table->addInvitee($this->inviteeRepository->find($invitee));
        }
        $this->tableRepository->save($table, true);

        return $this->json([
            'id' => $table->getId(),
            'seats' => $table->getSeats(),
            'invitees_id' => $table->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ], Response::HTTP_CREATED);
    }
}
