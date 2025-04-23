@echo off
REM Windows batch script to add admin with command line arguments
REM Usage: scripts\add-admin.bat username password email "Full Name" role

REM Check if required arguments are provided
if "%~3"=="" (
  echo Error: Insufficient arguments
  echo Usage: scripts\add-admin.bat username password email [full_name] [role]
  echo Example: scripts\add-admin.bat admin admin123 admin@example.com "Admin User" super_admin
  exit /b 1
)

REM Get arguments
set ADMIN_USERNAME=%~1
set ADMIN_PASSWORD=%~2
set ADMIN_EMAIL=%~3

REM Handle optional arguments with defaults
if "%~4"=="" (
  set ADMIN_FULLNAME=Admin User
) else (
  set ADMIN_FULLNAME=%~4
)

if "%~5"=="" (
  set ADMIN_ROLE=super_admin
) else (
  set ADMIN_ROLE=%~5
)

REM Run the Node.js script
node scripts/add-admin.js

REM Clean up environment variables
set ADMIN_USERNAME=
set ADMIN_PASSWORD=
set ADMIN_EMAIL=
set ADMIN_FULLNAME=
set ADMIN_ROLE= 