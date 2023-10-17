<?php declare(strict_types=1);

namespace App\Controller\Api\Card;

use App\Entity\Card;
use App\Repository\CardRepository;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class DeleteCardController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
    ) {}

    #[Route(
        path: '/card/{card_id}',
        name: 'api_card_delete',
        requirements: ['card_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_DELETE],
    )]
    #[OA\Response(response: Response::HTTP_NO_CONTENT, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Tag('Card')]
    public function __invoke(#[MapEntity(id: 'card_id')] Card $card): JsonResponse
    {
        $this->cardRepository->remove($card, true);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}