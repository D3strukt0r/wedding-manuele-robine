<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class IndexController extends AbstractController
{
    #[Route(
        path: '/',
        name: 'index',
        methods: [Request::METHOD_GET],
    )]
    public function __invoke(): Response
    {
        return $this->render('index.html.twig');
    }
}
