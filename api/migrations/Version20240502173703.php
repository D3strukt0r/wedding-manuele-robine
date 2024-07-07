<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240502173703 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Fix deletion of related entities on cascade';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3BC3F045D');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3BC3F045D FOREIGN KEY (user_login_id) REFERENCES user (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE invitee DROP FOREIGN KEY FK_F7AADF3D759A837E');
        $this->addSql('ALTER TABLE invitee DROP FOREIGN KEY FK_F7AADF3D4ACC9A20');
        $this->addSql('ALTER TABLE invitee ADD CONSTRAINT FK_F7AADF3D759A837E FOREIGN KEY (table_to_sit_id) REFERENCES `table` (id) ON DELETE SET NULL');
        $this->addSql('ALTER TABLE invitee ADD CONSTRAINT FK_F7AADF3D4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE invitee DROP FOREIGN KEY FK_F7AADF3D759A837E');
        $this->addSql('ALTER TABLE invitee DROP FOREIGN KEY FK_F7AADF3D4ACC9A20');
        $this->addSql('ALTER TABLE invitee ADD CONSTRAINT FK_F7AADF3D759A837E FOREIGN KEY (table_to_sit_id) REFERENCES `table` (id)');
        $this->addSql('ALTER TABLE invitee ADD CONSTRAINT FK_F7AADF3D4ACC9A20 FOREIGN KEY (card_id) REFERENCES card (id)');
        $this->addSql('ALTER TABLE card DROP FOREIGN KEY FK_161498D3BC3F045D');
        $this->addSql('ALTER TABLE card ADD CONSTRAINT FK_161498D3BC3F045D FOREIGN KEY (user_login_id) REFERENCES user (id)');
    }
}
