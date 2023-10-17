<?php declare(strict_types=1);

namespace App\Controller\Api\Invitee;

use App\Dto\Invitee\UpdateInviteeDto;
use App\Entity\Invitee;
use App\Repository\InviteeRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

class UpdateInviteeController extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/invitee/{invitee_id}',
        name: 'api_invitee_update',
        requirements: ['invitee_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_PATCH, Request::METHOD_PUT],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: UpdateInviteeDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Invitee')]
    public function __invoke(
        #[MapEntity(id: 'invitee_id')] Invitee $invitee,
        #[MapRequestPayload] UpdateInviteeDto $dto
    ): JsonResponse {
        $invitee->update($dto);

        $this->inviteeRepository->save($invitee, true);

        return $this->json([
            'firstname' => $invitee->getFirstname(),
            'lastname' => $invitee->getLastname(),
            'email' => $invitee->getEmail(),
            'will_come' => $invitee->willCome(),
            'food' => $invitee->getFood(),
            'allergies' => $invitee->getAllergies(),
            'table_id' => $invitee->getTable()?->getId(),
            'card_id' => $invitee->getCard()?->getId(),
        ]);
    }
}
