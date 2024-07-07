<?php declare(strict_types=1);

namespace App\Service\User;

class PasswordGenerator
{
    public function generate(int $length = 20): string
    {
        $vowels = 'aeui';
        $consonants = 'bdghjmnpqrstvwyzucd';
        $consonants .= 'BDGHJLMNPQRSTVWYXZUCD';
        $consonants .= '123456789';
        $vowels .= 'AEUI';

        $pw = '';
        $alt = time() % 2;
        for ($i = 0; $i < $length; ++$i) {
            if ($alt === 1) {
                $pw .= $consonants[random_int(0, mt_getrandmax()) % \strlen($consonants)];
            } else {
                $pw .= $vowels[random_int(0, mt_getrandmax()) % \strlen($vowels)];
            }
            $alt = ($alt === 1) ? 0 : 1;
        }

        return $pw;
    }
}
