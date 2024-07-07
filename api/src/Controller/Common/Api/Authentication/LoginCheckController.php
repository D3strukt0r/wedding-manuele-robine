<?php declare(strict_types=1);

namespace App\Controller\Common\Api\Authentication;

use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class LoginCheckController extends AbstractController
{
    #[Route(
        path: '/login_check',
        name: 'api_common_login_check',
        options: ['expose' => true],
        methods: [Request::METHOD_POST],
    )]
    #[OA\RequestBody(required: true, content: new OA\JsonContent(properties: [
        new OA\Property(property: 'username', type: 'string'),
        new OA\Property(property: 'password', type: 'string'),
    ]))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns a JWT token', content: new OA\JsonContent(properties: [
        new OA\Property(property: 'token', type: 'string'),
    ]))]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Invalid credentials')]
    #[OA\Tag('Common/Authentication')]
    public function __invoke(): void
    {
        // Handled by Symfony
    }
}
