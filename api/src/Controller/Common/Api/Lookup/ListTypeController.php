<?php declare(strict_types=1);

namespace App\Controller\Common\Api\Lookup;

use App\Entity\Food;
use App\Entity\Role;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ListTypeController extends AbstractController
{
    #[Route(
        path: '/lookup/type/{type}',
        name: 'api_common_lookup_type_list',
        requirements: ['type' => '[a-zA-Z]+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Type not found')]
    #[OA\Tag('Common/Lookup')]
    public function __invoke(string $type): JsonResponse
    {
        $matchedType = match($type) {
            'food' => Food::class,
            'role' => Role::class,
            default => null,
        };

        if ($matchedType === null) {
            throw $this->createNotFoundException();
        }

        if (!is_a($matchedType, \BackedEnum::class, true)) {
            throw new \UnexpectedValueException('enum class must be a backed enum');
        }

        return $this->json($matchedType::cases());
    }
}
