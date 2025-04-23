# QAirline Server Scripts

This directory contains utility scripts for the QAirline server application.

## Add Admin Account

The scripts in this directory allow you to add admin accounts directly to the database with proper password hashing.

### Prerequisites

- Node.js and npm must be installed
- Database connection must be properly configured in your `.env` file
- Required packages must be installed via `npm install`

### Using the Script

#### On Windows:

```bash
scripts\add-admin.bat username password email "Full Name" role
```

Example:

```bash
scripts\add-admin.bat admin Admin123! admin@qaairline.com "Super Admin" super_admin
```

#### On Linux/macOS:

First make the script executable:

```bash
chmod +x scripts/add-admin.sh
```

Then run it:

```bash
./scripts/add-admin.sh username password email "Full Name" role
```

Example:

```bash
./scripts/add-admin.sh superadmin Pass123! admin@qaairline.com "Super Admin" super_admin
```

#### Parameters:

1. `username`: Admin username (required)
2. `password`: Admin password (required)
3. `email`: Admin email address (required)
4. `"Full Name"`: Admin's full name (optional, use quotes for names with spaces)
5. `role`: Admin role (optional, defaults to "super_admin")

#### Valid Admin Roles:

- `super_admin`: Has full access to all admin features
- `flight_manager`: Can manage flights, airplanes, airports, bookings
- `news_manager`: Can manage news and content

### Directly Using Node.js

You can also run the script directly with Node.js and environment variables:

```bash
# Set environment variables
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=securepassword
export ADMIN_EMAIL=admin@example.com
export ADMIN_FULLNAME="Admin User"
export ADMIN_ROLE=super_admin

# Run script
node scripts/add-admin.js
```

On Windows CMD:

```cmd
set ADMIN_USERNAME=admin
set ADMIN_PASSWORD=securepassword
set ADMIN_EMAIL=admin@example.com
set ADMIN_FULLNAME=Admin User
set ADMIN_ROLE=super_admin
node scripts/add-admin.js
```

On Windows PowerShell:

```powershell
$env:ADMIN_USERNAME="admin"
$env:ADMIN_PASSWORD="securepassword"
$env:ADMIN_EMAIL="admin@example.com"
$env:ADMIN_FULLNAME="Admin User"
$env:ADMIN_ROLE="super_admin"
node scripts/add-admin.js
``` 