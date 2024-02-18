<?php declare(strict_types=1);

namespace App\Migrations\Factory;

use App\Migrations\AbstractMigrationWithCommand;
use Doctrine\Migrations\AbstractMigration;
use Doctrine\Migrations\Version\MigrationFactory;
use Symfony\Component\HttpKernel\KernelInterface;

/**
 * Inject container to migration
 *
 * @link https://symfony.com/bundles/DoctrineMigrationsBundle/current/index.html#migration-dependencies
 */
readonly class MigrationFactoryDecorator implements MigrationFactory
{
    public function __construct(
        private MigrationFactory $migrationFactory,
        private KernelInterface $kernel,
    ) {}

    public function createVersion(string $migrationClassName): AbstractMigration
    {
        $instance = $this->migrationFactory->createVersion($migrationClassName);

        if ($instance instanceof AbstractMigrationWithCommand) {
            $instance->setKernel($this->kernel);
        }

        return $instance;
    }
}
