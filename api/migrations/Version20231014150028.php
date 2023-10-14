<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20231014150028 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create tables';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE card (id INT AUTO_INCREMENT NOT NULL, login_code VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE invitee (id INT AUTO_INCREMENT NOT NULL, table_to_sit_id INT DEFAULT NULL, card_id INT DEFAULT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, email VARCHAR(255) DEFAULT NULL, will_come TINYINT(1) DEFAULT NULL, food VARCHAR(255) DEFAULT NULL, allergies VARCHAR(255) DEFAULT NULL, INDEX IDX_F7AADF3D759A837E (table_to_sit_id), INDEX IDX_F7AADF3D4ACC9A20 (card_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `table` (id INT AUTO_INCREMENT NOT NULL, seats INT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE invitee ADD CONSTRAINT FK_F7AADF3D759A837E FOREIGN KEY (table_to_sit_id) REFERENCES `table` (id)');
        $this->addSql('ALTER TABLE invitee ADD CONSTRAINT FK_F7AADF3D4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invitee DROP FOREIGN KEY FK_F7AADF3D759A837E');
        $this->addSql('ALTER TABLE invitee DROP FOREIGN KEY FK_F7AADF3D4ACC9A20');
        $this->addSql('DROP TABLE card');
        $this->addSql('DROP TABLE invitee');
        $this->addSql('DROP TABLE `table`');
    }
}
