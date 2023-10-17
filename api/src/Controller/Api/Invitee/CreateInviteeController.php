<?php declare(strict_types=1);

namespace App\Controller\Api\Invitee;

use App\Dto\Invitee\CreateInviteeDto;
use App\Entity\Invitee;
use App\Repository\InviteeRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

class CreateInviteeController extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/invitee',
        name: 'api_invitee_create',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: CreateInviteeDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Invitee')]
    public function __invoke(#[MapRequestPayload] CreateInviteeDto $dto): JsonResponse
    {
        $invitee = Invitee::create($dto);

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
        ], Response::HTTP_CREATED);
    }
}
