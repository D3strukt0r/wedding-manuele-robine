<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\GalleryRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GalleryRepository::class)]
class Gallery
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'gallery', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false)]
    private User $user;

    /** @var null|array<int> */
    #[ORM\Column(type: Types::SIMPLE_ARRAY, nullable: true)]
    private ?array $fileIds = null;

    public function __construct(User $user)
    {
        $this->user = $user;
        $this->user->setGallery($this);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): User
    {
        return $this->user;
    }

    /**
     * @return array<int>
     */
    public function getFileIds(): array
    {
        return $this->fileIds ?? [];
    }

    /**
     * @param null|array<int> $fileIds
     *
     * @return $this
     */
    public function setFileIds(?array $fileIds): static
    {
        $this->fileIds = \is_array($fileIds) && \count($fileIds) === 0 ? null : $fileIds;

        return $this;
    }
}
