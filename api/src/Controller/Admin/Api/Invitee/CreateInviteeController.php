<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Invitee;

use App\Dto\Admin\Invitee\CreateInviteeDto;
use App\Dto\Admin\Invitee\InviteeShowDto;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Repository\CardRepository;
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
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class CreateInviteeController extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
        private readonly CardRepository $cardRepository,
        private readonly TableRepository $tableRepository,
    ) {}

    #[Route(
        path: '/invitees',
        name: 'api_admin_invitee_create',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: CreateInviteeDto::class)))]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Returns an invitee', content: new OA\JsonContent(ref: new Model(type: InviteeShowDto::class)))]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Invitee')]
    public function __invoke(#[MapRequestPayload] CreateInviteeDto $dto): JsonResponse
    {
        $table = $dto->tableId !== null ? $this->tableRepository->find($dto->tableId) : null;
        $card = $dto->cardId !== null ? $this->cardRepository->find($dto->cardId) : null;

        if (($dto->cardId !== null && $card === null) || ($dto->tableId !== null && $table === null)) {
            throw new UnprocessableEntityHttpException(\sprintf('Card with ID %s or table with ID %s not found', $dto->cardId, $dto->tableId));
        }

        $invitee = Invitee::create($dto);
        $invitee->setTable($table);
        $invitee->setCard($card);

        $this->inviteeRepository->save($invitee, true);

        return $this->json(new InviteeShowDto($invitee), Response::HTTP_CREATED);
    }
}
