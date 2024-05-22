<?php declare(strict_types=1);

namespace App\Service;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\AccessMapInterface;

readonly class PathRoles
{
    public function __construct(
        private AccessMapInterface $accessMap,
    ) {}

    /**
     * https://stackoverflow.com/a/25046487/4156752.
     *
     * @param string $uri is the path you want to check access to
     *
     * @return null|array<string> is the roles that have access to the path
     */
    public function getRoles(string $uri, string $method = 'GET'): ?array
    {
        // build a request based on path to check access
        $request = Request::create($uri, $method);
        [$roles, $channel] = $this->accessMap->getPatterns($request); // get access_control for this request

        return $roles;
    }
}
