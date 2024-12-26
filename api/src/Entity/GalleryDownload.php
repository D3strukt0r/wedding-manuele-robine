<?php declare(strict_types=1);

namespace App\Entity;

use App\Repository\FileRepository;
use App\Repository\GalleryDownloadRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GalleryDownloadRepository::class)]
class GalleryDownload
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /** @var array<int> */
    #[ORM\Column(type: Types::SIMPLE_ARRAY)]
    private array $fileIds;

    #[ORM\Column(length: 64)]
    private string $hash;

    #[ORM\Column]
    private GalleryDownloadState $state;

    #[ORM\Column]
    private array $stateContext = [];

    /**
     * @param array<File> $files
     */
    public function __construct(array $files)
    {
        $this->fileIds = array_map(static fn (File $file) => $file->getId(), $files);
        $this->state = GalleryDownloadState::PENDING;
        $this->hash = FileRepository::getHashForFileIds($files);
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return array<int>
     */
    public function getFileIds(): array
    {
        return $this->fileIds;
    }

    public function getState(): GalleryDownloadState
    {
        return $this->state;
    }

    public function getHash(): string
    {
        return $this->hash;
    }

    public function getStateContext(): array
    {
        return $this->stateContext;
    }

    public function setStateCreateZip(): void
    {
        $this->state = GalleryDownloadState::CREATE_ZIP;
    }

    public function setStateDownloading(int $countDone = 0): void
    {
        $this->state = GalleryDownloadState::DOWNLOADING;
        $this->stateContext = ['countDone' => $countDone];
    }

    public function setStateCaching(): void
    {
        $this->state = GalleryDownloadState::CACHING;
    }
}
