<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240524222728 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add tree structure to file table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE file ADD parent_id INT DEFAULT NULL, ADD metadata JSON DEFAULT NULL COMMENT \'(DC2Type:json)\'');
        $this->addSql('ALTER TABLE file ADD CONSTRAINT FK_8C9F3610727ACA70 FOREIGN KEY (parent_id) REFERENCES file (id)');
        $this->addSql('CREATE INDEX IDX_8C9F3610727ACA70 ON file (parent_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE file DROP FOREIGN KEY FK_8C9F3610727ACA70');
        $this->addSql('DROP INDEX IDX_8C9F3610727ACA70 ON file');
        $this->addSql('ALTER TABLE file DROP parent_id, DROP metadata');
    }
}
