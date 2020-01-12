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
composer require j7mbo/twitter-api-php league/oauth2-server:~6.0 drupal/core-recommended:~8.8.1 'phpdocumentor/reflection-docblock:^3.0||^4.0'

# Create the profile destination directory.
mkdir -p $PROFILE_DIR

# Extract the profile archive into it.
tar -x -f ../$ARCHIVE.tar --directory $PROFILE_DIR
cd ..

# Wrap it all up in a nice compressed tarball.
tar --exclude='.DS_Store' --exclude='._*' -c -z -f $DESTINATION/$ARCHIVE.tar.gz $ARCHIVE

# Clean up.
rm -r -f drush $ARCHIVE.tar $ARCHIVE
