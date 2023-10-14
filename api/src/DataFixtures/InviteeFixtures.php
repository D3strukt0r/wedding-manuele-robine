<?php declare(strict_types=1);

namespace App\DataFixtures;

use App\Entity\Invitee;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Faker\Generator;

class InviteeFixtures extends Fixture
{
    public const REFERENCE = 'AUTHORS_REFERENCE';

    private Generator $faker;

    public function __construct()
    {
        $this->faker = Factory::create();
    }

    public function load(ObjectManager $manager): void
    {
        for ($i = 0; $i < 10; $i++) {
            $manager->persist($this->getFakeInvitee());
        }

        $referenceInvitee = $this->getFakeInvitee();
        $this->addReference(self::REFERENCE, $referenceInvitee);

        $manager->persist($referenceInvitee);
        $manager->flush();
    }

    private function getFakeInvitee(): Invitee
    {
        return new Invitee(
          $this->faker->firstName(),
            $this->faker->lastName(),
        );
    }
}
