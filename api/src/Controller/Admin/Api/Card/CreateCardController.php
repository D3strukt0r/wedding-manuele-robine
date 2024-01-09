<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Card;

use App\Dto\Card\CreateCardDto;
use App\Entity\Card;
use App\Entity\Invitee;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use App\Repository\UserRepository;
use Hidehalo\Nanoid\Client;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class CreateCardController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly InviteeRepository $inviteeRepository,
        private readonly UserRepository $userRepository,
    ) {}

    #[Route(
        path: '/cards',
        name: 'api_admin_card_create',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: CreateCardDto::class)))]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Admin/Card')]
    public function __invoke(#[MapRequestPayload] CreateCardDto $dto): JsonResponse
    {
        $card = new Card();
        foreach ($dto->invitees_id as $invitee) {
            $card->addInvitee($this->inviteeRepository->find($invitee));
        }
        $user = $this->userRepository->find($dto->userLoginId);
        $card->setUserLogin($user);
        $this->cardRepository->save($card, true);

        return $this->json([
            'id' => $card->getId(),
            'user_login_id' => $card->getUserLogin()?->getId(),
            'invitees_id' => $card->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ], Response::HTTP_CREATED);
    }
}
