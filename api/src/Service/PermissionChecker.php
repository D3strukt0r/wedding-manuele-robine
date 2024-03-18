<?php

namespace App\Service;

use Symfony\Component\Routing\RouterInterface;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;

readonly class PermissionChecker
{
    public function __construct(
        private PathRoles $pathRoles,
        private RouterInterface $router,
        private AuthorizationCheckerInterface $authorizationChecker,
    ) {}

    /**
     * @param array $actions
     * @return array<string, bool>
     */
    public function __invoke(array $actions): array
    {
        // Check "access_control" in security.yaml first
        $processedActions = [];
        foreach ($actions as $action => $routeAndParameters) {
            $url = $this->router->generate($routeAndParameters[0], $routeAndParameters[1]);
            $roles = $this->pathRoles->getRoles($url);
            foreach ($roles as $role) {
                if (isset($processedActions[$action]) && $processedActions[$action]) {
                    continue;
                }
                $processedActions[$action] = $this->authorizationChecker->isGranted($role);
            }
        }

        // TODO: Then check the IsGranted annotation
        // $map = $this->container->get(AccessMapInterface::class);
        // $request = $this->container->get(Request::class);
        // $token = $this->container->get('security.token_storage')->getToken();
        // $isGranted = $map->isGranted($request, $actions, $token);

        // $router = $this->container->get('router');
        // // get route name from __invoke function in controller class through attributes
        // $refClass = new \ReflectionClass($actions[0]);
        // $refFunction = $refClass->getMethod('__invoke');
        // $routeName = $refFunction->getAttributes(Route::class)[0]->newInstance()->getName();
        // $route = $this->generateUrl($routeName, ['user_id' => $user->getId()]);

        return $processedActions;
    }
}
