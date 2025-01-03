<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Card;

use App\Dto\Admin\Card\CardListDto;
use App\Dto\Common\ListQueryDto;
use App\Entity\Card;
use App\Entity\Role;
use App\Repository\CardRepository;
use App\Service\PermissionChecker;
use Nelmio\ApiDocBundle\Attribute\Model;
use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ListCardsController extends AbstractController
{
    public function __construct(
        private readonly CardRepository $cardRepository,
        private readonly PermissionChecker $permissionChecker,
    ) {}

    #[Route(
        path: '/cards',
        name: 'api_admin_card_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a list of cards', content: new OA\JsonContent(properties: [
        new OA\Property(property: 'total', type: 'integer'),
        new OA\Property(property: 'offset', type: 'integer'),
        new OA\Property(property: 'limit', type: 'integer'),
        new OA\Property(property: 'records', type: 'array', items: new OA\Items(
            ref: new Model(type: CardListDto::class)
        )),
    ]))]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Card')]
    public function __invoke(#[MapQueryString] ListQueryDto $query = new ListQueryDto()): JsonResponse
    {
        $cards = $this->cardRepository->findBy([], [], $query->limit, $query->offset);

        return $this->json([
            'total' => $this->cardRepository->count([]),
            'offset' => $query->offset,
            'limit' => $query->limit,
            'records' => array_map(function (Card $card) {
                $actions = ($this->permissionChecker)([
                    'update' => ['api_admin_card_update', ['card_id' => $card->getId()]],
                    'delete' => ['api_admin_card_delete', ['card_id' => $card->getId()]],
                ]);

                return new CardListDto($card, $actions);
            }, $cards),
        ]);
    }
}
