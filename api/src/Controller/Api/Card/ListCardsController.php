<?php

namespace App\Controller\Api\Card;

use App\Repository\CardRepository;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ListCardsController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
    ) {}

    #[Route(
        path: '/card',
        name: 'api_cards_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Tag('Card')]
    public function __invoke(): JsonResponse
    {
        return $this->json(array_map(fn ($card) => [
            'id' => $card->getId(),
            'loginCode' => $card->getLoginCode(),
            'invitees' => $card->getInvitees()->map(fn ($invitee) => $invitee->getId())->toArray(),
        ], $this->cardRepository->findAll()));
    }
}
