# Fretboard Trainer
A 'what's the note?' guitar fretboard trainer in Vue.js, Typescript & .NET Core Azure Functions.

JAMstack architecture using secured Azure Functions for backend work.

# Architecture

![Diagram of architecture](docs/fretboard-architecture.png)  

### Function App
`fn-fretboard`  
Plan - Consumption Plan  
.NET Core 3.1 (Windows)  

### Storage Accounts
1. Supporting storage account for the function app - `stfnfretboard` (V1 - cheaper for behind the scences function workings)  
2. Storage account to host static content and application data - `stfretboard` (V2)  

### Active Directory
App Registrations  
1. `fretboard_web` The SPA will authenticate against this.  
2. `fretboard_api` Secures the Function App. It trusts `fretboard_web`  

# Documentation

## Deployment
Environment creation and deployment has been automated using PowerShell and ARM Templates  
[View deployment docs](docs/deployment.md)

## Vue.js and Typescript
[Adventures with Vue.js, Vuex, axios, TypeScript](docs/vue.md)

## Authentication
The application is secured via OAuth 2.0 and OpenID Connect and the Azure Functions are secured by bearer token headers.  
[documentation regarding configuration of authentication](/docs/authentication.md)

## Todo/ideas
[Wish list of things I'll probably never get around to doing](/docs/ideas.md)