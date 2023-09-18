<?php declare(strict_types=1);

namespace App\Migrations;

use Doctrine\Migrations\AbstractMigration;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\DependencyInjection\ContainerAwareInterface;
use Symfony\Component\DependencyInjection\ContainerAwareTrait;

/**
 * Abstract base class to use commands in fixtures.
 */
abstract class AbstractMigrationWithCommand extends AbstractMigration implements ContainerAwareInterface
{
    use ContainerAwareTrait;

    protected function execCommand(string $command, array $options = []): void
    {
        $kernel = $this->container->get('kernel');
        $application = new Application($kernel);
        $application->setAutoExit(false);

        $options = array_merge([
            'command' => $command,
            '--no-interaction' => true,
            '--env' => 'prod',
        ], $options);
        $application->run(new ArrayInput($options));
    }

    protected function loadFixture(array $group, bool $append = true): void
    {
        $this->execCommand('doctrine:fixtures:load', ['--group' => $group, '--append' => $append]);
    }
}
