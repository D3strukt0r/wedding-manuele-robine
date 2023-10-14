<?php declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Invitee;
use App\Entity\Table;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;

class TableFixtures extends Fixture
{
    public const REFERENCE = 'TABLE_REFERENCE';

    private Generator $faker;

    public function __construct()
    {
        $this->faker = Factory::create();
    }

    public function load(ObjectManager $manager): void
    {
        $referenceTable = $this->getFakeTable();
        $this->addReference(self::REFERENCE, $referenceTable);

        $manager->persist($referenceTable);
        $manager->flush();
    }

    private function getFakeTable(): Table
    {
        $table = new Table(
          $this->faker->numberBetween(1, 10),
        );
        $table->addInvitee($this->getReference(InviteeFixtures::REFERENCE));
        return $table;
    }
}
