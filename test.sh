#!/bin/bash

# Define the environment file
ENV_FILE=".test-env"
LOADED=0

# Function to prompt for input with a default value
prompt_input() {
  local var_name="$1"
  local prompt_text="$2"
  local default_value="$3"
  local input

  read -r -p "$prompt_text [$default_value]: " input
  if [ -z "$input" ]; then
    eval "$var_name=\"$default_value\""
  else
    eval "$var_name=\"$input\""
  fi
}

# Function to load environment variables if the file exists
load_previous_config() {
  if [ -f "$ENV_FILE" ]; then
    echo "Previous configuration found in $ENV_FILE."
    source "$ENV_FILE"
    read -r -p "Do you want to use the last saved configuration? (Y/n): " USE_SAVED
    if [[ "$USE_SAVED" =~ ^[Yy]$ ]] || [ -z "$USE_SAVED" ]; then
      echo "Using saved configuration."
      LOADED=1
      return 0
    else
      echo "Re-entering configuration..."
      return 1
    fi
  fi
  return 1
}

# Ensure phpunit.xml is in place
if [ ! -f html/core/phpunit.xml ]; then
  echo "Copying phpunit.xml.dist to phpunit.xml..."
  cp html/core/phpunit.xml.dist html/core/phpunit.xml
else
  echo "phpunit.xml is already in place."
fi

# Load previous configuration if available
if [ -z "$1" ] && load_previous_config; then
  echo "Using previously saved configuration."
else
  # Get SIMPLETEST_BASE_URL as a parameter or prompt for it
  if [ -n "$1" ]; then
    SIMPLETEST_BASE_URL="$1"
  else
    prompt_input "SIMPLETEST_BASE_URL" "Enter the SIMPLETEST_BASE_URL" "https://my-awesome.domain.com"
  fi
fi
export SIMPLETEST_BASE_URL

# Load previous database configuration if available
if [ -n "$2" ]; then
  SIMPLETEST_DB="$2"
elif [ "$LOADED" == "1" ]; then
  SIMPLETEST_DB="mysql://$DB_USERNAME:$DB_PASSWORD@$DB_HOSTNAME/$DB_NAME"
fi
if [ "$LOADED" == "1" ]; then
  if mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" -h"$DB_HOSTNAME" -e "USE $DB_NAME;" 2>/dev/null; then
    echo "Database connection successful."
  else
    echo "Database connection failed."
    LOADED=0;
  fi
fi
if [ ! -n "$2" ] && [ "$LOADED" == "0" ]; then
  while true; do
    echo "Enter database connection details:"
    prompt_input "DB_USERNAME" "Database Username" "${DB_USERNAME:-root}"
    read -s -r -p "Database Password: " DB_PASSWORD
    echo
    prompt_input "DB_HOSTNAME" "Database Hostname" "${DB_HOSTNAME:-localhost}"
    prompt_input "DB_NAME" "Database Name" "${DB_NAME:-drupal}"

    SIMPLETEST_DB="mysql://$DB_USERNAME:$DB_PASSWORD@$DB_HOSTNAME/$DB_NAME"

    # Test database connection
    if mysql -u"$DB_USERNAME" -p"$DB_PASSWORD" -h"$DB_HOSTNAME" -e "USE $DB_NAME;" 2>/dev/null; then
      echo "Database connection successful."
      break
    else
      echo "Database connection failed. Please re-enter the details."
    fi
  done
fi
export SIMPLETEST_DB

# Save configuration for future use
cat > "$ENV_FILE" <<EOL
SIMPLETEST_BASE_URL='$SIMPLETEST_BASE_URL'
DB_USERNAME='$DB_USERNAME'
DB_PASSWORD='$DB_PASSWORD'
DB_HOSTNAME='$DB_HOSTNAME'
DB_NAME='$DB_NAME'
SIMPLETEST_DB='$SIMPLETEST_DB'
EOL

echo "Configuration saved in $ENV_FILE."

if [ ! -d "html/sites/simpletest" ]; then
  mkdir html/sites/simpletest;
fi
#if [ ! -d "html/sites/simpletest/browser_output" ]; then
#  mkdir html/sites/simpletest/browser_output;
#fi
# Run PHPUnit tests
vendor/bin/phpunit -c html/core/phpunit.xml html/profiles/wxt/tests

