<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240429211557 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add unique name to tables';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE `table` ADD name VARCHAR(255) NOT NULL');
        $this->addSql('UPDATE `table` SET name = id WHERE name IS NULL OR name = \'\'');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_F6298F465E237E06 ON `table` (name)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_F6298F465E237E06 ON `table`');
        $this->addSql('ALTER TABLE `table` DROP name');
    }
}
