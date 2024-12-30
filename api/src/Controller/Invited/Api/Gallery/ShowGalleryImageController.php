<?php declare(strict_types=1);

namespace App\Controller\Invited\Api\Gallery;

use App\Entity\File;
use League\Flysystem\FilesystemOperator;
use OpenApi\Attributes as OA;
use Symfony\Bridge\Doctrine\Attribute\MapEntity;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;
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
        $location = $file->getPath();

        // $content = $this->defaultStorage->read($location);

        // $response = new Response();
        // $disposition = $response->headers->makeDisposition(HeaderUtils::DISPOSITION_INLINE, $file->getOriginalFilename());
        // $response->headers->set('Content-Disposition', $disposition);
        // $response->headers->set('Content-Type', $file->getMimeType());
        // $response->setContent($content);

        // return $response;

        $contentStream = $this->defaultStorage->readStream($location);

        // https://dev.to/rubenrubiob/serve-a-file-stream-in-symfony-3ei3
        return new StreamedResponse(
            static function () use ($contentStream): void {
                fpassthru($contentStream);
            },
            Response::HTTP_OK,
            [
                'Content-Transfer-Encoding', 'binary',
                'Content-Disposition' => HeaderUtils::makeDisposition(HeaderUtils::DISPOSITION_INLINE, $file->getOriginalFilename()),
                'Content-Type' => $file->getMimeType(),
                'Content-Length' => $this->defaultStorage->fileSize($location),
            ],
        );
    }
}
