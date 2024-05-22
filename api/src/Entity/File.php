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

    public function __construct(UploadedFile $file, string $path, int $size)
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

    public function addFileMapping(FileMapping $fileMapping): static
    {
        if (!$this->fileMappings->contains($fileMapping)) {
            $this->fileMappings->add($fileMapping);
            $fileMapping->setFile($this);
        }

        return $this;
    }

    public function removeFileMapping(FileMapping $fileMapping): static
    {
        if ($this->fileMappings->removeElement($fileMapping)) {
            // set the owning side to null (unless already changed)
            // if ($fileMapping->getFile() === $this) {
            //     $fileMapping->setFile(null);
            // }
            // use $em->remove($fileMapping) instead
        }

        return $this;
    }
}
