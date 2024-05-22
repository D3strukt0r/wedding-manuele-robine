<?php declare(strict_types=1);

namespace App\Repository;

use App\Entity\FileMapping;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<FileMapping>
 *
 * @method null|FileMapping find($id, $lockMode = null, $lockVersion = null)
 * @method null|FileMapping findOneBy(array $criteria, array $orderBy = null)
 * @method FileMapping[]    findAll()
 * @method FileMapping[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class FileMappingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, FileMapping::class);
    }
}
