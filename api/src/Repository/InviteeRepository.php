<?php declare(strict_types=1);

namespace App\Repository;

use App\Entity\Invitee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Invitee>
 *
 * @method Invitee|null find($id, $lockMode = null, $lockVersion = null)
 * @method Invitee|null findOneBy(array $criteria, array $orderBy = null)
 * @method Invitee[]    findAll()
 * @method Invitee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class InviteeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Invitee::class);
    }
}
