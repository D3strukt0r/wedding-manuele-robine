<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\User;

use App\Entity\Role;
use App\Entity\User;
use App\Repository\UserRepository;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class DeleteUserController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    #[Route(
        path: '/users/{user_id}',
        name: 'api_admin_user_delete',
        requirements: ['user_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_DELETE],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_NO_CONTENT, description: 'Returns no content')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/User')]
    public function __invoke(#[MapEntity(id: 'user_id')] User $user): JsonResponse
    {
        $this->userRepository->remove($user, true);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
