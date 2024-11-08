<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\FileRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Gedmo\Mapping\Annotation as Gedmo;
use Symfony\Component\HttpFoundation\File\UploadedFile;

#[ORM\Entity(repositoryClass: FileRepository::class)]
class File
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $path;

    #[ORM\Column(length: 255)]
    private string $originalFilename;

    #[ORM\Column(length: 255)]
    private string $mimeType;

    #[ORM\Column(length: 255)]
    private string $checksum;

    #[ORM\Column]
    private int $size;

    /** @var array<mixed> */
    #[ORM\Column(nullable: true)]
    private ?array $metadata = null;

    #[ORM\Column]
    #[Gedmo\Blameable(on: 'create')]
    private string $createdBy;

    #[ORM\Column]
    #[Gedmo\Timestampable(on: 'create')]
    private \DateTimeImmutable $createdAt;

    /**
     * @var Collection<int, FileMapping>
     */
    #[ORM\OneToMany(mappedBy: 'file', targetEntity: FileMapping::class, orphanRemoval: true)]
    private Collection $fileMappings;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'children')]
    private ?self $parent = null;

    /**
     * @var Collection<int, self>
     */
    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: self::class)]
    private Collection $children;

    /**
     * @param array<mixed> $metadata
     */
    public function __construct(UploadedFile $file, string $path, int $size, ?self $parent = null, ?array $metadata = null)
    {
        $this->fileMappings = new ArrayCollection();
        $this->path = $path;
        $this->originalFilename = $file->getClientOriginalName();
        $this->mimeType = $file->getClientMimeType();
        $checksum = hash_file('sha3-256', $file->getPathname());
        if ($checksum === false) {
            throw new \RuntimeException('Could not calculate checksum');
        }
        $this->checksum = $checksum;
        $this->size = $size;
        $this->metadata = \is_array($metadata) && \count($metadata) === 0 ? null : $metadata;
        $this->parent = $parent;
        $this->children = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPath(): string
    {
        return $this->path;
    }

    public function getOriginalFilename(): string
    {
        return $this->originalFilename;
    }

    public function getMimeType(): string
    {
        return $this->mimeType;
    }

    public function getChecksum(): string
    {
        return $this->checksum;
    }

    public function getSize(): int
    {
        return $this->size;
    }

    /**
     * @return null|array<mixed>
     */
    public function getMetadata(): ?array
    {
        return $this->metadata;
    }

    /**
     * @param null|array<mixed> $metadata
     */
    public function setMetadata(?array $metadata): void
    {
        $this->metadata = $metadata;
    }

    public function getCreatedBy(): string
    {
        return $this->createdBy;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * @return Collection<int, FileMapping>
     */
    public function getFileMappings(): Collection
    {
        return $this->fileMappings;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    /**
     * @return Collection<int, self>
     */
    public function getChildren(): Collection
    {
        return $this->children;
    }
}
