<?php declare(strict_types=1);

use PhpCsFixer\Config;
use PhpCsFixer\Finder;

$finder = Finder::create()
    ->ignoreDotFiles(false)
    ->ignoreVCSIgnored(true)
    ->notPath('config/bundles.php')
    ->notPath('public/index.php')
    ->exclude('.docker')
    ->exclude('var')
    ->in(__DIR__)
;

// https://github.com/FriendsOfPHP/PHP-CS-Fixer/blob/master/doc/ruleSets/index.rst
// https://github.com/FriendsOfPHP/PHP-CS-Fixer/blob/master/doc/rules/index.rst
$config = new Config();

return $config
    ->setRiskyAllowed(true)
    ->setRules(
        [
            '@PHP80Migration:risky' => true,
            '@PHP82Migration' => true,
            '@PHPUnit84Migration:risky' => true,
            '@PhpCsFixer' => true,
            '@PhpCsFixer:risky' => true,
            // No header, since no licence to put
            'header_comment' => [
                'header' => '',
            ],
            // Fix PhpUnit wrong access
            'php_unit_test_case_static_method_calls' => [
                'call_type' => 'self',
            ],
            // Don't use unreadable yoda style
            'yoda_style' => [
                'equal' => false,
                'identical' => false,
                'less_and_greater' => false,
            ],
            // Required, so "declare(strict_types=1);" is always on top
            'blank_line_after_opening_tag' => false,
            'linebreak_after_opening_tag' => false,
            // Reset order to simply put traits first
            'ordered_class_elements' => ['order' => ['use_trait']],
            // Keep single line DocBlocks to overwrite types
            'single_line_comment_style' => ['comment_types' => ['hash']],
            // Remove "yield" from requiring one space before (from base @PhpCsFixer)
            'blank_line_before_statement' => ['statements' => [
                'break', 'continue', 'declare', 'default', 'exit', 'goto',
                'include', 'include_once', 'phpdoc', 'require', 'require_once',
                'return', 'switch', 'throw', 'try', 'yield_from',
            ]],
            // Add PhpUnit DocBlocks grouping
            'phpdoc_separation' => ['groups' => [
                ['deprecated', 'link', 'see', 'since'],
                ['author', 'copyright', 'license'],
                ['category', 'package', 'subpackage'],
                ['property', 'property-read', 'property-write'],
                // PhpUnit
                ['internal', 'internalNothing', 'covers', 'coversNothing'],
            ]],
            // Keep space between constructor parameters in Messages
            'method_argument_space' => ['on_multiline' => 'ignore'],
            // Revert requiring @covers/@coversNothing for tests
            'php_unit_test_class_requires_covers' => false,
        ]
    )
    ->setFinder($finder)
;
