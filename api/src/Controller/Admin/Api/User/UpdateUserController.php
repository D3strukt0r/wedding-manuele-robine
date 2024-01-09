<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\User;

use App\Dto\User\UpdateUserDto;
use App\Entity\User;
use App\Repository\UserRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class UpdateUserController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {}

    #[Route(
        path: '/users/{user_id}',
        name: 'api_admin_user_update',
        requirements: ['user_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_PATCH, Request::METHOD_PUT],
    )]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: UpdateUserDto::class)))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Success case')]
    #[OA\Response(response: Response::HTTP_NOT_FOUND, description: 'Entity with ID not found')]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Tag('Admin/User')]
    public function __invoke(
        #[MapEntity(id: 'user_id')] User $user,
        #[MapRequestPayload] UpdateUserDto $dto
    ): JsonResponse {
        if (
            $user->getUsername() !== $dto->username
            && $this->userRepository->findOneBy(['username' => $dto->username])
        ) {
            throw new UnprocessableEntityHttpException(sprintf('User with username %s already exists', $dto->username));
        }

        $user->update($dto, $this->passwordHasher);

        $this->userRepository->save($user, true);

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'plainPassword' => $dto->newPassword,
            'roles' => $user->getRoles(),
        ]);
    }
}
