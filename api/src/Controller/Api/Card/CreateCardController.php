<?php declare(strict_types=1);

namespace App\Controller\Api\Card;

use App\Dto\Card\CreateCardDto;
use App\Entity\Card;
use App\Entity\Invitee;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use Hidehalo\Nanoid\Client;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Annotation\Route;

class CreateCardController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/cards',
        name: 'api_card_create',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: CreateCardDto::class)))]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Card')]
    public function __invoke(#[MapRequestPayload] CreateCardDto $dto): JsonResponse
    {
        $client = new Client();

        $uid = $client->generateId();

        $card = new Card($uid);
        foreach ($dto->invitees as $invitee) {
            $card->addInvitee($this->inviteeRepository->find($invitee));
        }
        $this->cardRepository->save($card, true);

        return $this->json([
            'id' => $card->getId(),
            'loginCode' => $card->getLoginCode(),
            'invitees_id' => $card->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ], Response::HTTP_CREATED);
    }
}
