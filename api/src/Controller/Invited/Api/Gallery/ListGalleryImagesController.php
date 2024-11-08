<?php declare(strict_types=1);

namespace App\Controller\Invited\Api\Gallery;

use App\Dto\Invited\ListGalleryImagesDto;
use App\Entity\Gallery;
use App\Repository\FileRepository;
use App\Repository\GalleryRepository;
use League\Flysystem\FilesystemOperator;
use Nelmio\ApiDocBundle\Attribute\Model;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ListGalleryImagesController extends AbstractController
{
    public function __construct(
        private readonly FilesystemOperator $defaultStorage,
        private readonly GalleryRepository $galleryRepository,
        private readonly FileRepository $fileRepository,
    ) {}

    #[Route(
        path: '/gallery',
        name: 'api_invited_gallery_show',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted('PUBLIC_ACCESS')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns my gallery', content: new OA\JsonContent(ref: new Model(type: ListGalleryImagesDto::class)))]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Invited/Gallery')]
    public function __invoke(): JsonResponse
    {
        $fileIds = $this->galleryRepository->findAllFileIds();
        $files = $this->fileRepository->findByGivenIdsSortedByTakenOn($fileIds);
        // TODO: File IDs set in gallery, but not existing in file repository, are silently ignored. Cron Job for cleanup?

        return $this->json(new ListGalleryImagesDto($files, $this->defaultStorage));
    }
}
