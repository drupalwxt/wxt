#!/bin/bash
DESTINATION=`pwd`
WORK_DIR=/tmp
ARCHIVE=wxt-8.x-$1
PROFILE_DIR=profiles/wxt
YAML_CLI=`command -v yaml-cli`

# Ensure yaml-cli is installed, since we need it to set version numbers
# in the info files. `composer global require grasmash/yaml-cli`
if [[ ! $YAML_CLI ]]; then
  echo "Cannot set version in info files because yaml-cli is not in your PATH."
  exit 1
fi

# Update version number in info files.
find . -name "*.info.yml" -exec $YAML_CLI update:value {} version 8.x-$1 \;

# Create an archive of the profile to be added to the tarball.
composer archive --file $ARCHIVE --dir $WORK_DIR

# Remove modifications to info files.
git reset --hard

# Switch to a scratch directory.
cd $WORK_DIR

# Download Drush 8, which has the make command, and make it executable.
curl -L -o drush https://github.com/drush-ops/drush/releases/download/8.1.16/drush.phar
chmod +x drush

./drush make $DESTINATION/drupal-org-core.make $ARCHIVE
./drush make --no-core $DESTINATION/drupal-org.make $ARCHIVE

# Add required Composer dependencies.
cd $ARCHIVE
rm composer.json composer.lock
cat <<EOF > composer.json
{
    "name": "drupal/drupal",
    "description": "Drupal is an open source content management platform powering millions of websites and applications.",
    "type": "project",
    "license": "GPL-2.0-or-later",
    "homepage": "https://www.drupal.org/project/drupal",
    "support": {
        "docs": "https://www.drupal.org/docs/user_guide/en/index.html",
        "chat": "https://www.drupal.org/node/314178"
    },
    "require": {
        "composer/installers": "^1.0.24",
        "drupal/core": "8.8.2",
        "drupal/core-project-message": "8.8.2",
        "drupal/core-vendor-hardening": "8.8.2",
        "wikimedia/composer-merge-plugin": "^1.4"
    },
    "require-dev": {
        "behat/mink": "1.7.x-dev",
        "behat/mink-goutte-driver": "^1.2",
        "behat/mink-selenium2-driver": "1.3.x-dev",
        "composer/composer": "^1.9.1",
        "drupal/coder": "^8.3.2",
        "jcalderonzumba/gastonjs": "^1.0.2",
        "jcalderonzumba/mink-phantomjs-driver": "^0.3.1",
        "mikey179/vfsstream": "^1.6.8",
        "phpunit/phpunit": "^6.5 || ^7",
        "phpspec/prophecy": "^1.7",
        "symfony/css-selector": "^3.4.0",
        "symfony/phpunit-bridge": "^3.4.3",
        "symfony/debug": "^3.4.0",
        "justinrainbow/json-schema": "^5.2",
        "symfony/filesystem": "~3.4.0",
        "symfony/finder": "~3.4.0",
        "symfony/lock": "~3.4.0",
        "symfony/browser-kit": "^3.4.0"
    },
    "minimum-stability": "dev",
    "prefer-stable": true,
    "config": {
        "preferred-install": "dist",
        "autoloader-suffix": "Drupal8"
    },
    "extra": {
        "_readme": [
            "By default Drupal loads the autoloader from ./vendor/autoload.php.",
            "To change the autoloader you can edit ./autoload.php.",
            "This file specifies the packages.drupal.org repository.",
            "You can read more about this composer repository at:",
            "https://www.drupal.org/node/2718229"
        ],
        "merge-plugin": {
            "recurse": true,
            "replace": false,
            "merge-extra": false
        },
        "installer-paths": {
            "core": ["type:drupal-core"],
            "libraries/{$name}": ["type:drupal-library"],
            "modules/contrib/{$name}": ["type:drupal-module"],
            "profiles/contrib/{$name}": ["type:drupal-profile"],
            "themes/contrib/{$name}": ["type:drupal-theme"],
            "drush/Commands/contrib/{$name}": ["type:drupal-drush"],
            "modules/custom/{$name}": ["type:drupal-custom-module"],
            "themes/custom/{$name}": ["type:drupal-custom-theme"]
        },
        "drupal-core-project-message": {
            "post-install-cmd-message": [
                "<bg=blue;fg=white>drupal/drupal</>: This package is meant for core development,",
                "               and not intended to be used for production sites.",
                "               See: https://www.drupal.org/node/3082474"
            ],
            "post-create-project-cmd-message": [
                "<bg=red;fg=white>drupal/drupal</>: This package is meant for core development,",
                "               and not intended to be used for production sites.",
                "               See: https://www.drupal.org/node/3082474"
            ]
        }
    },
    "autoload": {
        "psr-4": {
            "Drupal\\Core\\Composer\\": "core/lib/Drupal/Core/Composer"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "Drupal\\Composer\\": "composer"
        }
    },
    "scripts": {
        "pre-install-cmd": "Drupal\\Composer\\Composer::ensureComposerVersion",
        "pre-update-cmd": "Drupal\\Composer\\Composer::ensureComposerVersion",
        "pre-autoload-dump": "Drupal\\Core\\Composer\\Composer::preAutoloadDump",
        "drupal-phpunit-upgrade-check": "Drupal\\Core\\Composer\\Composer::upgradePHPUnit",
        "drupal-phpunit-upgrade": "@composer update phpunit/phpunit symfony/phpunit-bridge phpspec/prophecy symfony/yaml --with-dependencies --no-progress",
        "post-update-cmd": [
            "Drupal\\Composer\\Composer::generateMetapackages",
            "Drupal\\Composer\\Composer::ensureBehatDriverVersions"
        ],
        "phpcs": "phpcs --standard=core/phpcs.xml.dist --runtime-set installed_paths $($COMPOSER_BINARY config vendor-dir)/drupal/coder/coder_sniffer --",
        "phpcbf": "phpcbf --standard=core/phpcs.xml.dist --runtime-set installed_paths $($COMPOSER_BINARY config vendor-dir)/drupal/coder/coder_sniffer --"
    },
    "repositories": [
        {
            "type": "composer",
            "url": "https://packages.drupal.org/8"
        },
        {
            "type": "path",
            "url": "core"
        },
        {
            "type": "path",
            "url": "composer/Plugin/ProjectMessage"
        },
        {
            "type": "path",
            "url": "composer/Plugin/VendorHardening"
        }
    ]
}
EOF
composer require 'j7mbo/twitter-api-php' 'league/oauth2-server:~7.1' 'drupal/core-recommended:8.8.2' 'phpdocumentor/reflection-docblock:^3.0||^4.0'

# Create the profile destination directory.
mkdir -p $PROFILE_DIR

# Extract the profile archive into it.
tar -x -f ../$ARCHIVE.tar --directory $PROFILE_DIR
cd ..

# Wrap it all up in a nice compressed tarball.
tar --exclude='.DS_Store' --exclude='._*' -c -z -f $DESTINATION/$ARCHIVE.tar.gz $ARCHIVE

# Clean up.
rm -r -f drush $ARCHIVE.tar $ARCHIVE
