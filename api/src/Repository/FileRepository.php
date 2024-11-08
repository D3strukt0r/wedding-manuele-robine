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
        $qb = $this->createQueryBuilder('f');

        // https://stackoverflow.com/questions/45137881/sort-by-json-field-values
        /** @var array<array{0: File, takenOn: string}> $files */
        $files = $qb
            ->select('f')
            ->addSelect('JSON_EXTRACT(f.metadata, \'$.taken_on\') AS takenOn')
            ->where($qb->expr()->in('f.id', $fileIds))
            ->orderBy('takenOn', 'DESC')
            // TODO: Prefer this way, but it does not work, syntax error
            // ->orderBy('f.metadata->"$.taken_on"', 'DESC')
            ->getQuery()
            ->getResult()
        ;

        return array_map(static fn (array $file) => $file[0], $files);
    }
}
