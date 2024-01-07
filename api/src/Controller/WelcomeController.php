<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class WelcomeController extends AbstractController
{
    #[Route('/welcome', name: 'welcome')]
    public function __invoke(): Response
    {
        return $this->render('welcome.html.twig');
    }
}
