<?php declare(strict_types=1);

namespace App\Controller\Invited\Api\Gallery;

use App\Dto\Invited\ListGalleryImagesDto;
use App\Entity\Gallery;
use App\Entity\Role;
use App\Entity\User;
use App\Repository\FileRepository;
use App\Repository\GalleryRepository;
use Doctrine\ORM\EntityManagerInterface;
use League\Flysystem\FilesystemOperator;
use Nelmio\ApiDocBundle\Attribute\Model;
use Nelmio\ApiDocBundle\Attribute\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ShowMyGalleryImagesController extends AbstractController
{
    public function __construct(
        private readonly FilesystemOperator $defaultStorage,
        private readonly GalleryRepository $galleryRepository,
        private readonly FileRepository $fileRepository,
        private readonly EntityManagerInterface $em,
    ) {}

    #[Route(
        path: '/gallery/my',
        name: 'api_invited_gallery_show_my',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::USER->value)]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns my gallery', content: new OA\JsonContent(ref: new Model(type: ListGalleryImagesDto::class)))]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Invited/Gallery')]
    public function __invoke(#[CurrentUser] User $currentUser): JsonResponse
    {
        $gallery = $this->galleryRepository->findOneBy(['user' => $currentUser]);
        if ($gallery === null) {
            $gallery = new Gallery($currentUser);
            $this->em->persist($gallery);
            $this->em->flush();
        }

        $files = array_map(fn (int $fileId) => $this->fileRepository->find($fileId), $gallery->getFileIds());
        if (\in_array(null, $files, true)) {
            throw $this->createNotFoundException('File not found');
        }

        return $this->json(new ListGalleryImagesDto($files, $this->defaultStorage));
    }
}
