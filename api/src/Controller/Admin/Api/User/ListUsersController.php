<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\User;

use App\Entity\User;
use App\Repository\UserRepository;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ListUsersController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
    ) {}

    #[Route(
        path: '/users',
        name: 'api_admin_user_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Tag('Admin/User')]
    public function __invoke(): JsonResponse
    {
        return $this->json(array_map(static fn (User $user) => [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'roles' => $user->getRoles(),
        ], $this->userRepository->findAll()));
    }
}
