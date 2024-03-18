<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Card;

use App\Dto\Admin\Card\CardShowDto;
use App\Entity\Card;
use App\Entity\Role;
use App\Service\PermissionChecker;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ShowCardController extends AbstractController
{
    public function __construct(
        private readonly PermissionChecker $permissionChecker,
    ) {}

    #[Route(
        path: '/cards/{card_id}',
        name: 'api_admin_card_show',
        requirements: ['card_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a card', content: new OA\JsonContent(ref: new Model(type: CardShowDto::class)))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Card')]
    public function __invoke(#[MapEntity(id: 'card_id')] Card $card): JsonResponse
    {
        $actions = ($this->permissionChecker)([
            'update' => ['api_admin_card_update', ['card_id' => $card->getId()]],
            'delete' => ['api_admin_card_delete', ['card_id' => $card->getId()]],
        ]);

        return $this->json(new CardShowDto($card, $actions));
    }
}
