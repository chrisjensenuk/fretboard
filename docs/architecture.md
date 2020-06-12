# Architecture

![Diagram of architecture](fretboard-architecture.png)

## Functions
Plan - Consumption Plan
.NET Core 3.1 (Windows)
CORS - include origin of SPA app

## Storage Accounts
1. Supporting storage account to support the function app - stfnfretboard (V1 - cheaper for behind the scences function workings)
2. Storage account to host static content (SPA app in $web Blob container) - stfretboard (V2)

## Active Directory
1. App Registration - fretboard  
The function app is integrated with the Microsft Identity Platform via this App Registration.


