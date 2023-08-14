#!/bin/bash

ARCHIVE=wxt-$1
PROFILE_DIR=profiles/contrib/wxt
YAML_CLI=`command -v yaml-cli`

# Ensure yaml-cli is installed, since we need it to set version numbers
# in the info files.
if [[ ! $YAML_CLI ]]; then
  echo "Cannot set version in info files because yaml-cli is not in your PATH."
  exit 1
fi

rm -rf $ARCHIVE
composer create-project --stability beta --no-install drupal/legacy-project:10.0.10 $ARCHIVE
composer dump-autoload
composer configure-tarball $ARCHIVE

# Update version number in info files.
find . -name "*.info.yml" -exec $YAML_CLI update:value {} version $1 \;

# Create an archive of the profile to be added to the tarball.
composer archive --file $ARCHIVE

# Remove modifications to info files.
git reset --hard

cd $ARCHIVE
composer config extra.enable-patching true
composer config minimum-stability dev
composer config prefer-stable true
for plugin in drupal/core-composer-scaffold composer/installers cweagans/installers cweagans/composer-patches oomphinc/composer-installers-extender dealerdirect/phpcodesniffer-composer-installer; do
  composer config --no-plugins allow-plugins.$plugin true
done
composer remove --no-update composer/installers
composer require --no-update "ext-dom:*" cweagans/composer-patches oomphinc/composer-installers-extender 'drupal/core:10.0.10'
composer update --ignore-platform-reqs

# Create the profile destination directory.
mkdir -p $PROFILE_DIR

# Extract the profile archive into it.
tar -x -f ../$ARCHIVE.tar --directory $PROFILE_DIR
cd ..

# Wrap it all up in a nice compressed tarball.
tar --exclude='.DS_Store' --exclude='._*' -c -z -f $ARCHIVE.tar.gz $ARCHIVE

# Clean up.
rm -r -f $ARCHIVE.tar $ARCHIVE
