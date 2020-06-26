# Deployment Instuctions

## One time configurations
The creation of the Azure Active Directory App Registrations needs to be done only once so its easiest to just do it in the portal.

### Create App Registrations for the SPA application
From the Azure Portal go to `Azure Active Directory` > `App registrations` > `New registration`

- name: `fretboard_web` 
- Authentication > Add a platform > SPA
- Redirect URI: https://stwebfretboard.z33.web.core.windows.net/
- Implict grant: ID tokens, Access Tokens

- name: `fretboard_api`
- Redirect URI: Web (not specified)
- Expose an API > Application ID URI > Set: https://fn-fretboard1.azurewebsites.net
- Add scope > scope name: user_impersonation, Who can consent: Admins only
- Authorized client applications > Add a client application > Client ID: fretboard_web client id. Authorized scopes: .../user_impersonation

## Creating and Deploying the Resource Groups
The below assumes you have installed:
- NET CLI / Visual Studio
- Vue CLI
- Azure Powershell Module
- AzCopy

Update [deploy.ps1](/deploy.ps1) and set the variables `$name`, `$location`, `$aadApiClientId`  
From PowerShell navigate to the root of the repo and execute  
```
./deploy.ps1
```

This script can be used to create/update the deployment. It does the following.

- Creates the resource group
- Deploys the [azuredeployjson](/azuredeploy.json) ARM Template
- Builds, publishes and zip deploys the .NET Function app
- Builds and `azcopy` the Vue SPA front end

Deployment is now done!

# Manual Deployment Steps
Instead of running deploy.ps1 then you can manually configure the environments by following these steps:

Create a Resource Group

Static Website hosting for SPA application
- Create Storage account - stfretboard
- Storage account > Static website > Enabled
- Index document name: index.html
- Error document path: 404.html
- Save (Primary endpoint is displayed)

Create a Function App
- Function App > Authentication / Authorization
- App Service Authentication: On
- Authentication Providers > Azure Axtive Directory > Configure
- Advanced
- Client ID = AAD Client Id of App Registration `fretboard_api`
- Issuer Url = https://sts.windows.net/{AAD tenant id}/
- Allowed Token Audience = AAD `fretboard_api`'s Application ID URI (Should be the same url the function app)
- OK then Save!
- CORS > Add the URL of the SPA application
- To App Settings add `TableStorageConnection` with the value of a connection strign to the stdatafretboard storage account.

## Deploying static website to blob storage
Install azcopy and add location to Environment Variables `PATH`. Navigate to the root folder.
- Storage account > Access control: Give the user 'Storage Blob Data Contributor' role
Once you've logged in you may need to wait a few minutes for the above permission change to take effect before copying the files
```
azcopy login --tenant-id=a061aca6-27f7-48ab-81c8-172f7bc9f4e9
azcopy copy 'dist/*' 'https://stwebfretboard.blob.core.windows.net/$web' --recursive
```

## Deploying Function App
Just use Visual Studio's `Publish` functionality to deploy

# Further Info

## ARM Template
ARM Template was created by:
- first manaully creating the environment using the Portal.
- From resource view Export all the resources for the group
- Following examples from the [Quick Start Templates](https://azure.microsoft.com/en-us/resources/templates/) cut out the bits I don't need
- Use [Azure Resource Explorer](https://resources.azure.com) to get further information what wasn't included in the export, such as `appSettings` & `siteAuthSettings`.