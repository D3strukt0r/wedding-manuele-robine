<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\User;

use App\Dto\Admin\User\UserListDto;
use App\Dto\Admin\User\UsersQueryDto;
use App\Entity\Role;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\PermissionChecker;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ListUsersController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly PermissionChecker $permissionChecker,
    ) {}

    #[Route(
        path: '/users',
        name: 'api_admin_user_list',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Parameter(name: 'limit', in: 'query', description: 'The field used to limit the number of records returned', schema: new OA\Schema(type: 'integer'))]
    #[OA\Parameter(name: 'offset', in: 'query', description: 'The field used to offset the records returned', schema: new OA\Schema(type: 'integer'))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a list of users', content: new OA\JsonContent(properties: [
        new OA\Property(property: 'total', type: 'integer'),
        new OA\Property(property: 'offset', type: 'integer'),
        new OA\Property(property: 'limit', type: 'integer'),
        new OA\Property(property: 'records', type: 'array', items: new OA\Items(
            ref: new Model(type: UserListDto::class)
        )),
    ]))]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/User')]
    public function __invoke(#[MapQueryString] UsersQueryDto $query = new UsersQueryDto()): JsonResponse
    {
        $users = $this->userRepository->findBy([], [], $query->limit, $query->offset);
        return $this->json([
            'total' => $this->userRepository->count([]),
            'offset' => $query->offset,
            'limit' => $query->limit,
            'records' => array_map(function (User $user) {
                $actions = ($this->permissionChecker)([
                    'update' => ['api_admin_user_update', ['user_id' => $user->getId()]],
                    'delete' => ['api_admin_user_delete', ['user_id' => $user->getId()]],
                ]);

                return new UserListDto($user, $actions);
            }, $users),
        ]);
    }
}
