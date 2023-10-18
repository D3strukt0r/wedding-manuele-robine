<?php declare(strict_types=1);

namespace App\Controller\Api\Table;

use App\Dto\Table\UpdateTableDto;
use App\Entity\Invitee;
use App\Entity\Table;
use App\Repository\InviteeRepository;
use App\Repository\TableRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Annotation\Route;

class UpdateTableController extends AbstractController
{
    public function __construct(
        private readonly TableRepository $tableRepository,
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/tables/{table_id}',
        name: 'api_table_update',
        requirements: ['table_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_PATCH, Request::METHOD_PUT],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: UpdateTableDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Table')]
    public function __invoke(
        #[MapEntity(id: 'table_id')] Table $table,
        #[MapRequestPayload] UpdateTableDto $dto
    ): JsonResponse {
        $table->update($dto);

        $inviteesIs = $table->getInvitees();
        $inviteesToBe = [];
        foreach ($dto->invitees as $inviteeId) {
            $inviteesToBe[$inviteeId] = $this->inviteeRepository->find($inviteeId);
        }

        $inviteesNotFound = array_filter($inviteesToBe, static fn (?Invitee $invitee) => $invitee === null);
        if (count($inviteesNotFound) > 0) {
            throw new NotFoundHttpException(sprintf('Invitees with IDs %s not found', implode(', ', array_keys($inviteesNotFound))));
        }

        foreach ($inviteesToBe as $invitee) {
            if (!$inviteesIs->contains($invitee)) {
                $table->addInvitee($invitee);
            }
        }
        foreach ($inviteesIs->toArray() as $invitee) {
            if (!in_array($invitee->getId(), $dto->invitees, true)) {
                $table->removeInvitee($invitee);
            }
        }

        $this->tableRepository->save($table, true);

        return $this->json([
            'id' => $table->getId(),
            'seats' => $table->getSeats(),
            'invitees_id' => $table->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ]);
    }
}
