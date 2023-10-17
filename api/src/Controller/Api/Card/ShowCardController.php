<?php declare(strict_types=1);

namespace App\Controller\Api\Card;

use App\Entity\Card;
use App\Entity\Invitee;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ShowCardController extends AbstractController
{
    #[Route(
        path: '/card/{card_id}',
        name: 'api_card_show',
        requirements: ['card_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Tag('Card')]
    public function __invoke(#[MapEntity(id: 'card_id')] Card $card): JsonResponse
    {
        return $this->json([
            'id' => $card->getId(),
            'loginCode' => $card->getLoginCode(),
            'invitees_id' => $card->getInvitees()->map(fn (Invitee $invitee) => $invitee->getId())->toArray(),
        ]);
    }
}
