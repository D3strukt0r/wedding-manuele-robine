<?php declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class PingController extends AbstractController
{
    #[Route(
      path: '/ping.{_format}',
      name: 'ping',
      requirements: ['_format' => 'json'],
      options: ['expose' => true],
      methods: [Request::METHOD_GET],
      format: 'json',
    )]
    public function __invoke(): Response
    {
        return $this->json(['ping' => 'pong']);
    }
}
