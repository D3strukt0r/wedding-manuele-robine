<?php declare(strict_types=1);

namespace App\Controller\Invited\Api\Gallery;

use App\Entity\File;
use League\Flysystem\FilesystemOperator;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ShowGalleryImageController extends AbstractController
{
    public function __construct(
        private readonly FilesystemOperator $defaultStorage,
    ) {}

    #[Route(
        path: '/gallery/{file_id}',
        name: 'api_invited_gallery_show_image',
        requirements: ['file_id' => '\d+'],
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted('PUBLIC_ACCESS')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns my image')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Invited/Gallery')]
    public function __invoke(#[MapEntity(id: 'file_id')] File $file): Response
    {
        $content = $this->defaultStorage->read($file->getPath());

        $response = new Response();
        $disposition = $response->headers->makeDisposition(ResponseHeaderBag::DISPOSITION_INLINE, $file->getOriginalFilename());
        $response->headers->set('Content-Disposition', $disposition);
        $response->headers->set('Content-Type', $file->getMimeType());
        $response->setContent($content);

        return $response;
    }
}
