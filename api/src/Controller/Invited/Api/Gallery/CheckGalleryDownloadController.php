<?php declare(strict_types=1);

namespace App\Controller\Invited\Api\Gallery;

use App\Repository\GalleryDownloadRepository;
use League\Flysystem\FilesystemOperator;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class CheckGalleryDownloadController extends AbstractController
{
    public function __construct(
        private readonly FilesystemOperator $defaultStorage,
        private readonly GalleryDownloadRepository $galleryDownloadRepository,
    ) {}

    #[Route(
        path: '/gallery/check-download',
        name: 'api_invited_gallery_download_check',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted('PUBLIC_ACCESS')]
    #[OA\Parameter(name: 'fileIds', description: '"all" or comma-separated list of ids', in: 'query', schema: new OA\Schema(type: 'string', example: '1,5,8'))]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns file resource')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Invited/Gallery')]
    public function __invoke(Request $request): Response
    {
        $hash = $request->query->get('hash'); // hash for zip file name

        $location = 'large-downloads/'.$hash.'.zip';
        if ($this->defaultStorage->fileExists($location)) {
            return $this->json(['message' => 'Download ready'], Response::HTTP_OK);
        }

        $galleryDownload = $this->galleryDownloadRepository->findOneBy(['hash' => $hash]);
        if ($galleryDownload === null) {
            return $this->json(['message' => 'Download never initiated'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'message' => 'Preparing download, you will be updated shortly',
            'state' => $galleryDownload->getState(),
            'context' => $galleryDownload->getStateContext(),
            'fileCount' => \count($galleryDownload->getFileIds()),
        ], Response::HTTP_ACCEPTED);
    }
}
