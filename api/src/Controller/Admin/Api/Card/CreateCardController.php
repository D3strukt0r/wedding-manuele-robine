<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Card;

use App\Dto\Admin\Card\CardShowDto;
use App\Dto\Admin\Card\CreateCardDto;
use App\Entity\Card;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use App\Repository\UserRepository;
use Nelmio\ApiDocBundle\Attribute\Model;
use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

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
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: CreateCardDto::class)))]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Returns a card', content: new OA\JsonContent(ref: new Model(type: CardShowDto::class)))]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Card')]
    public function __invoke(#[MapRequestPayload] CreateCardDto $dto): JsonResponse
    {
        $card = new Card();

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
            $card->addInvitee($invitee);
        }
        if ($dto->userLoginId !== null) {
            $user = $this->userRepository->find($dto->userLoginId);
            $card->setUserLogin($user);
        }
        $this->cardRepository->save($card, true);

        return $this->json(new CardShowDto($card), Response::HTTP_CREATED);
    }
}
