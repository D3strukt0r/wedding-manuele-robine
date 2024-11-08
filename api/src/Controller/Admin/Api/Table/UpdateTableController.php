<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Table;

use App\Dto\Admin\Table\TableShowDto;
use App\Dto\Admin\Table\UpdateTableDto;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Entity\Table;
use App\Repository\InviteeRepository;
use App\Repository\TableRepository;
use Nelmio\ApiDocBundle\Attribute\Model;
use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UpdateTableController extends AbstractController
{
    public function __construct(
        private readonly TableRepository $tableRepository,
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/tables/{table_id}',
        name: 'api_admin_table_update',
        requirements: ['table_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_PATCH, Request::METHOD_PUT],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: UpdateTableDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a table', content: new OA\JsonContent(ref: new Model(type: TableShowDto::class)))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Table')]
    public function __invoke(
        #[MapEntity(id: 'table_id')] Table $table,
        #[MapRequestPayload] UpdateTableDto $dto
    ): JsonResponse {
        $table->update($dto);

        $inviteesIs = $table->getInvitees();
        $inviteesToBe = [];
        foreach ($dto->inviteeIds as $inviteeId) {
            $inviteesToBe[$inviteeId] = $this->inviteeRepository->find($inviteeId);
        }

        $inviteesNotFound = array_filter($inviteesToBe, static fn (?Invitee $invitee) => $invitee === null);
        if (\count($inviteesNotFound) > 0) {
            throw new UnprocessableEntityHttpException(\sprintf('Invitees with IDs %s not found', implode(', ', array_keys($inviteesNotFound))));
        }

        /** @var array<int, Invitee> $inviteesToBe */
        foreach ($inviteesToBe as $invitee) {
            if (!$inviteesIs->contains($invitee)) {
                $table->addInvitee($invitee);
            }
        }
        foreach ($inviteesIs->toArray() as $invitee) {
            if (!\in_array($invitee->getId(), $dto->inviteeIds, true)) {
                $table->removeInvitee($invitee);
            }
        }

        $this->tableRepository->save($table, true);

        return $this->json(new TableShowDto($table));
    }
}
