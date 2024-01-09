<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240108230557 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE card ADD user_login_id INT NOT NULL, DROP login_code');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3BC3F045D FOREIGN KEY (user_login_id) REFERENCES user (id)');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_161498D3BC3F045D ON card (user_login_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3BC3F045D');
        $this->addSql('DROP INDEX UNIQ_161498D3BC3F045D ON card');
        $this->addSql('ALTER TABLE card ADD login_code VARCHAR(255) NOT NULL, DROP user_login_id');
    }
}
