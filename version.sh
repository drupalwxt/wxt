#!/bin/bash

composer global require grasmash/yaml-cli --ignore-platform-reqs

export PATH=~/.composer/vendor/bin:$PATH

YAML_CLI=`command -v yaml-cli`

# Ensure yaml-cli is installed, since we need it to set version numbers
# in the info files.
if [[ ! $YAML_CLI ]]; then
  echo "Cannot set version in info files because yaml-cli is not in your PATH."
  exit 1
fi

# Update version number in info files.
find . -name "*.info.yml" -exec $YAML_CLI update:value {} version $1 \;
