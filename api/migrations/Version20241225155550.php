<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20241225155550 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add async gallery donwloads';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE gallery_download (id INT AUTO_INCREMENT NOT NULL, file_ids LONGTEXT NOT NULL COMMENT \'(DC2Type:simple_array)\', hash VARCHAR(64) NOT NULL, state VARCHAR(255) NOT NULL, state_context JSON NOT NULL COMMENT \'(DC2Type:json)\', PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE gallery_download');
    }
}