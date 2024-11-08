<?php declare(strict_types=1);

namespace App\Repository;

use App\Entity\Gallery;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Gallery>
 *
 * @method null|Gallery find($id, $lockMode = null, $lockVersion = null)
 * @method null|Gallery findOneBy(array $criteria, array $orderBy = null)
 * @method Gallery[]    findAll()
 * @method Gallery[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class GalleryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Gallery::class);
    }

    /**
     * @return array<int>
     */
    public function findAllFileIds(): array
    {
        /** @var array<array{fileIds: array<string>}> $galleries */
        $galleries = $this->createQueryBuilder('g')
            ->select('g.fileIds')
            ->getQuery()
            ->getArrayResult()
        ;

        $fileIds = array_reduce($galleries,
            static fn (array $carry, mixed $gallery) => array_merge($carry, $gallery['fileIds']),
            [],
        );

        // Convert to array of integers and sort ascending
        $fileIds = array_map(intval(...), $fileIds);
        sort($fileIds);

        return $fileIds;
    }
}
