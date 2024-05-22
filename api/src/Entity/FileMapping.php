<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\FileMappingRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FileMappingRepository::class)]
class FileMapping
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $entity;

    #[ORM\Column]
    private int $entityId;

    #[ORM\Column(length: 255)]
    private string $entityField;

    #[ORM\ManyToOne(inversedBy: 'fileMappings')]
    #[ORM\JoinColumn(nullable: false)]
    private File $file;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEntity(): string
    {
        return $this->entity;
    }

    public function setEntity(string $entity): static
    {
        $this->entity = $entity;

        return $this;
    }

    public function getEntityId(): int
    {
        return $this->entityId;
    }

    public function setEntityId(int $entityId): static
    {
        $this->entityId = $entityId;

        return $this;
    }

    public function getEntityField(): string
    {
        return $this->entityField;
    }

    public function setEntityField(string $entityField): static
    {
        $this->entityField = $entityField;

        return $this;
    }

    public function getFile(): File
    {
        return $this->file;
    }

    public function setFile(File $file): static
    {
        $this->file = $file;

        return $this;
    }
}
