<?php declare(strict_types=1);

namespace App\Repository;

use App\Entity\Invitee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Invitee>
 *
 * @method null|Invitee find($id, $lockMode = null, $lockVersion = null)
 * @method null|Invitee findOneBy(array $criteria, array $orderBy = null)
 * @method Invitee[]    findAll()
 * @method Invitee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InviteeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invitee::class);
    }

    public function save(Invitee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Invitee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
