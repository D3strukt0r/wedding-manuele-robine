<?php declare(strict_types=1);

namespace App\Migrations;

use Doctrine\Migrations\AbstractMigration;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\HttpKernel\KernelInterface;

/**
 * Abstract base class to use commands in fixtures.
 */
abstract class AbstractMigrationWithCommand extends AbstractMigration
{
    private KernelInterface $kernel;

    public function setKernel(KernelInterface $kernel): void
    {
        $this->kernel = $kernel;
    }

    /**
     * @param array<string, array<string>|bool|int|string> $options
     */
    protected function execCommand(string $command, array $options = []): void
    {
        $application = new Application($this->kernel);
        $application->setAutoExit(false);

        $options = array_merge([
            'command' => $command,
            '--no-interaction' => true,
            '--env' => 'prod',
        ], $options);
        $application->run(new ArrayInput($options));
    }

    /**
     * @param array<string> $group
     */
    protected function loadFixture(array $group, bool $append = true): void
    {
        $this->execCommand('doctrine:fixtures:load', ['--group' => $group, '--append' => $append]);
    }
}
