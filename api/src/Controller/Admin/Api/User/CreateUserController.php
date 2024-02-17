<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\User;

use App\Dto\User\UserCreateDto;
use App\Dto\User\UserShowDto;
use App\Entity\User;
use App\Repository\UserRepository;
use App\Service\User\PasswordGenerator;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class CreateUserController extends AbstractController
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly PasswordGenerator $passwordGenerator,
    ) {}

    #[Route(
        path: '/users',
        name: 'api_admin_user_create',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[Security(name: 'Bearer')]
    #[OA\RequestBody(content: new OA\JsonContent(ref: new Model(type: UserCreateDto::class)))]
    #[OA\Response(response: Response::HTTP_CREATED, description: 'Returns a user', content: new OA\JsonContent(ref: new Model(type: UserShowDto::class)))]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/User')]
    public function __invoke(#[MapRequestPayload] UserCreateDto $dto): JsonResponse
    {
        if ($this->userRepository->findOneBy(['username' => $dto->username])) {
            throw new UnprocessableEntityHttpException(sprintf('User with username %s already exists', $dto->username));
        }

        $plainPassword = $dto->password ?? $this->passwordGenerator->generate();
        $user = new User($dto->username, $this->passwordHasher, $plainPassword);

        $this->userRepository->save($user, true);

        return $this->json(new UserShowDto($user, $plainPassword), Response::HTTP_CREATED);
    }
}