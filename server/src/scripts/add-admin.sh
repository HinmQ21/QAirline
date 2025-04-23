#!/bin/bash

# Shell script to add admin with command line arguments
# Usage: ./scripts/add-admin.sh username password email "Full Name" role

# Check if required arguments are provided
if [ "$#" -lt 3 ]; then
  echo "Error: Insufficient arguments"
  echo "Usage: ./scripts/add-admin.sh username password email [full_name] [role]"
  echo "Example: ./scripts/add-admin.sh admin admin123 admin@example.com \"Admin User\" super_admin"
  exit 1
fi

# Get arguments
USERNAME=$1
PASSWORD=$2
EMAIL=$3
FULLNAME=${4:-"Admin User"}  # Default to "Admin User" if not provided
ROLE=${5:-"super_admin"}     # Default to "super_admin" if not provided

# Export as environment variables for the Node script
export ADMIN_USERNAME=$USERNAME
export ADMIN_PASSWORD=$PASSWORD
export ADMIN_EMAIL=$EMAIL
export ADMIN_FULLNAME=$FULLNAME
export ADMIN_ROLE=$ROLE

# Run the Node.js script
node scripts/add-admin.js

# Clean up environment variables
unset ADMIN_USERNAME
unset ADMIN_PASSWORD
unset ADMIN_EMAIL
unset ADMIN_FULLNAME
unset ADMIN_ROLE 