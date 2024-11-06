<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Card;

use App\Dto\Admin\Card\CardShowDto;
use App\Dto\Admin\Card\UpdateCardDto;
use App\Entity\Card;
use App\Entity\Invitee;
use App\Entity\Role;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use App\Repository\UserRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
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

class UpdateCardController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly InviteeRepository $inviteeRepository,
        private readonly UserRepository $userRepository,
    ) {}

    #[Route(
        path: '/cards/{card_id}',
        name: 'api_admin_card_update',
        requirements: ['card_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_PATCH, Request::METHOD_PUT],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: UpdateCardDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a card', content: new OA\JsonContent(ref: new Model(type: CardShowDto::class)))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Card')]
    public function __invoke(
        #[MapEntity(id: 'card_id')] Card $card,
        #[MapRequestPayload] UpdateCardDto $dto
    ): JsonResponse {
        $user = $dto->userLoginId !== null ? $this->userRepository->find($dto->userLoginId) : null;
        $card->setUserLogin($user);

        $inviteesIs = $card->getInvitees();
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
                $card->addInvitee($invitee);
            }
        }
        foreach ($inviteesIs->toArray() as $invitee) {
            if (!\in_array($invitee->getId(), $dto->inviteeIds, true)) {
                $card->removeInvitee($invitee);
            }
        }

        $this->cardRepository->save($card, true);

        return $this->json(new CardShowDto($card));
    }
}
