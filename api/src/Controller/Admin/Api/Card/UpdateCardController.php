<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Card;

use App\Dto\Card\UpdateCardDto;
use App\Entity\Card;
use App\Entity\Invitee;
use App\Repository\CardRepository;
use App\Repository\InviteeRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Routing\Attribute\Route;

class UpdateCardController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/cards/{card_id}',
        name: 'api_admin_card_update',
        requirements: ['card_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_PATCH, Request::METHOD_PUT],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: UpdateCardDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Admin/Card')]
    public function __invoke(
        #[MapEntity(id: 'card_id')] Card $card,
        #[MapRequestPayload] UpdateCardDto $dto
    ): JsonResponse {
        if ($dto->renewLoginCode) {
            $card->renewLoginCode();
        }

        $inviteesIs = $card->getInvitees();
        $inviteesToBe = [];
        foreach ($dto->invitees_id as $inviteeId) {
            $inviteesToBe[$inviteeId] = $this->inviteeRepository->find($inviteeId);
        }

        $inviteesNotFound = array_filter($inviteesToBe, static fn (?Invitee $invitee) => $invitee === null);
        if (count($inviteesNotFound) > 0) {
            throw new UnprocessableEntityHttpException(sprintf('Invitees with IDs %s not found', implode(', ', array_keys($inviteesNotFound))));
        }

        foreach ($inviteesToBe as $invitee) {
            if (!$inviteesIs->contains($invitee)) {
                $card->addInvitee($invitee);
            }
        }
        foreach ($inviteesIs->toArray() as $invitee) {
            if (!in_array($invitee->getId(), $dto->invitees_id, true)) {
                $card->removeInvitee($invitee);
            }
        }

        $this->cardRepository->save($card, true);

        return $this->json([
            'id' => $card->getId(),
            'loginCode' => $card->getLoginCode(),
            'invitees_id' => $card->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ]);
    }
}
