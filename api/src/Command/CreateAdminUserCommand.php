<?php declare(strict_types=1);

namespace App\Command;

use App\Entity\Role;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:user:create:admin',
    description: 'Creates a user',
)]
class CreateAdminUserCommand extends Command
{
    public function __construct(
        private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $passwordHasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setHelp('This command allows you to create a admin user')
            ->addOption('username', 'u', InputOption::VALUE_REQUIRED, 'Username of the new user')
            ->addOption('password', 'p', InputOption::VALUE_REQUIRED, 'Password of the new user')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $username = $input->getOption('username');
        while ($username === null) {
            $username = $io->ask('Username');
        }
        if (!\is_string($username)) {
            $io->error('Username must be a string');

            return Command::FAILURE;
        }

        $password = $input->getOption('password');
        while ($password === null) {
            $password = $io->askHidden('Password');
        }
        if (!\is_string($password)) {
            $io->error('Password must be a string');

            return Command::FAILURE;
        }

        try {
            $user = new User($username, $this->passwordHasher, $password);
            $user->setRoles([Role::ADMIN]);
            $this->userRepository->save($user, true);

            $io->success('User created successfully');

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error($e->getMessage());

            return Command::FAILURE;
        }
    }
}
