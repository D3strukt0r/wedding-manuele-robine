<?php declare(strict_types=1);

namespace App\Controller\Admin\Api\Dashboard;

use App\Dto\Admin\Dashboard\DashboardShowDto;
use App\Entity\Role;
use App\Repository\InviteeRepository;
use Nelmio\ApiDocBundle\Annotation\Model;
use Nelmio\ApiDocBundle\Annotation\Security;
use OpenApi\Attributes as OA;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ShowDashboardController extends AbstractController
{
    public function __construct(
        private readonly InviteeRepository $inviteeRepository,
    ) {}

    #[Route(
        path: '/dashboard',
        name: 'api_admin_dashboard_show',
        options: ['expose' => true],
        methods: [Request::METHOD_GET],
    )]
    #[IsGranted(Role::ADMIN->value)]
    #[Security(name: 'Bearer')]
    #[OA\Response(response: Response::HTTP_OK, description: 'Returns all dashboard infos', content: new OA\JsonContent(ref: new Model(type: DashboardShowDto::class)))]
    #[OA\Response(response: Response::HTTP_UNPROCESSABLE_ENTITY, description: 'Body is invalid')]
    #[OA\Response(response: Response::HTTP_UNAUTHORIZED, description: 'Not authorized to access this resource', content: new OA\JsonContent(ref: '#/components/schemas/AuthError'))]
    #[OA\Tag('Admin/Dashboard')]
    public function index(): Response
    {
        $invitees = $this->inviteeRepository->findAll();

        $foodChoices = [];
        foreach ($invitees as $invitee) {
            if ($invitee->willCome() === false) {
                continue;
            }
            $food = $invitee->getFood()->value ?? 'not_decided';
            $foodChoices[$food] = ($foodChoices[$food] ?? 0) + 1;
        }

        $allergies = [];
        foreach ($invitees as $invitee) {
            $id = $invitee->getId();
            $allergiesString = $invitee->getAllergies();
            if ($id === null || $allergiesString === null || $allergiesString === '') {
                continue;
            }
            $allergies[] = [
                'inviteeId' => $id,
                'name' => $invitee->getFirstName().' '.$invitee->getLastName(),
                'allergies' => $allergiesString,
            ];
        }

        return $this->json(new DashboardShowDto($foodChoices, $allergies));
    }
}
