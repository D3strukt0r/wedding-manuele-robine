<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Card;

use App\Entity\Card;
use App\Repository\CardRepository;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DeleteCardController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
    ) {}

    #[Route(
        path: '/cards/{card_id}',
        name: 'api_admin_card_delete',
        requirements: ['card_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_DELETE],
    )]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_NO_CONTENT, description: 'Returns no content')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Card')]
    public function __invoke(#[MapEntity(id: 'card_id')] Card $card): JsonResponse
    {
        $this->cardRepository->remove($card, true);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
