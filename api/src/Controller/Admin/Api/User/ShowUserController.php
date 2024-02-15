<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\User;

use App\Dto\User\UserShowDto;
use App\Entity\User;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ShowUserController extends AbstractController
{
    #[Route(
        path: '/users/{user_id}',
        name: 'api_admin_user_show',
        requirements: ['user_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a user', content: new OA\JsonContent(ref: new Model(type: UserShowDto::class)))]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/User')]
    public function __invoke(#[MapEntity(id: 'user_id')] User $user): JsonResponse
    {
        return $this->json(new UserShowDto($user));
    }
}
