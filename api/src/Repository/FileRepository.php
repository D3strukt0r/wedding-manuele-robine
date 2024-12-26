<?php declare(strict_types=1);

namespace App\Repository;

use App\Entity\File;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<File>
 *
 * @method null|File find($id, $lockMode = null, $lockVersion = null)
 * @method null|File findOneBy(array $criteria, array $orderBy = null)
 * @method File[]    findAll()
 * @method File[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FileRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, File::class);
    }

    /**
     * @return array<File>
     */
    public function findByHasMetadata(): array
    {
        $qb = $this->createQueryBuilder('f');

        /** @var array<File> */
        return $qb
            ->where($qb->expr()->isNotNull('f.metadata'))
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * @param array<int> $fileIds
     *
     * @return array<File>
     */
    public function findByGivenIdsSortedByTakenOn(array $fileIds): array
    {
        if (empty($fileIds)) {
            return [];
        }

        $qb = $this->createQueryBuilder('f');

        // https://stackoverflow.com/questions/45137881/sort-by-json-field-values
        /** @var array<array{0: File, takenOn: string}> $files */
        $files = $qb
            ->select('f')
            ->addSelect('JSON_EXTRACT(f.metadata, \'$.taken_on\') AS takenOn')
            ->where($qb->expr()->in('f.id', $fileIds))
            ->orderBy('takenOn', 'ASC')
            // TODO: Prefer this way, but it does not work, syntax error
            // ->orderBy('f.metadata->"$.taken_on"', 'ASC')
            ->getQuery()
            ->getResult()
        ;

        return array_map(static fn (array $file) => $file[0], $files);
    }

    /**
     * @param array<int> $fileIds
     *
     * @return array<File>
     */
    public function findByNotGivenIds(array $fileIds): array
    {
        if (empty($fileIds)) {
            return $this->findAll();
        }

        $qb = $this->createQueryBuilder('f');

        return $qb
            ->where($qb->expr()->notIn('f.id', $fileIds))
            ->andWhere($qb->expr()->isNull('f.parent'))
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * Find file by given ids and get the parent file where available recursively.
     *
     * @param array<int> $fileIds
     *
     * @return array<File>
     */
    public function findParentByGivenIds(array $fileIds): array
    {
        if (empty($fileIds)) {
            return [];
        }

        $qb = $this->createQueryBuilder('f');

        /** @var array<File> */
        $files = $qb
            ->select('f')
            ->where($qb->expr()->in('f.id', $fileIds))
            ->getQuery()
            ->getResult()
        ;

        // Get all the high-res parent file for all files
        foreach ($files as $id => $file) {
            while ($file->getParent()) {
                $file = $file->getParent();
            }
            $files[$id] = $file;
        }

        return $files;
    }

    /**
     * @param array<File> $files
     */
    public static function getHashForFileIds(array $files): string
    {
        $sortedFileIds = array_map(static fn (File $file) => $file->getId(), $files);
        sort($sortedFileIds, SORT_NUMERIC);

        return hash('sha3-256', implode(',', $sortedFileIds));
    }
}
