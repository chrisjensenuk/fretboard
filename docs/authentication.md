# Authentication

I want the SPA frontend to be able to talk to Azure functions securely.  Theuser to log in to Azure AD and call the functions using a Bearer token.  The functions can be called with or without the user being authenticated.

# Authorization Setup
Correct as of 2020-06-10
- Create a Function App
- Function App > Authentication / Authorization
- App Service Authentication: On
- Authentication Providers > Azure Axtive Directory > Configure
- Express
- Create New AD App (Call it something general, this app could be used for all APIs not just functions)
- OK then Save!

Optional - Add yourself as the Owner of the ADD App
- Go to Azure Active Directory in the portal > App registrations > All applications
- click the ADD App you created above (Owners and add yourself - you don't need to do this but made sense to me)

Optional - Grant Consent
By default when users first log in they will be prompted to provide consent to the Application. You can skip this by blanket consenting for all users
- In the ADD App > API permissions
- click 'Grant admin consent for Default Directory'

Configuring ADD App for SPA access
- From Azure Active Directory >  App Registrations > click the ADD App >  Authentication
- I'm not using MSAL.js v2.0 (As B2C can't use it yet and I want to move to B2C) so need to Implicit grant Access tokens and ID tokens
- Optional for local development add 'https://localhost:8080' to Redirect URIs
- Save

# Environment setup

CORS
- Function App > fn-fretboard > CORS
- Add in the origin for the spa app
- Optional - for local testing add 'https://localhost:8080'

Static Website hosting
- Create Storage account - stfretboard
- Storage account > Static website > Enabled
- Index document name: index.html
- Error document path: 404.html
- Save (Primary endpoint is displayed)

Static Website Metrics
https://docs.microsoft.com/en-us/azure/storage/blobs/storage-blob-static-website-how-to?tabs=azure-portal#metrics  
- Storage account > Metrics
- Change timespan to 30 days
- Add Metric - Scope:stfretboard Metric, Namespace:Blob, Metric:Egress, Aggregation:Sum
- Add Filter - Property:API name, Values:GetWebContent

BLOB Containers now has a $web endpoint.

## Copying static website to blob storage
Install azcopy and add to Vironemtn Variables PATH. Navigate to the root folder.
- Storage account > Access control: Give the user 'Storage Blob Data Contributor' role
Once you've logged in you may need to wait a few minutes for the above permission change to take effect before copying the files
```
azcopy login --tenant-id=a061aca6-27f7-48ab-81c8-172f7bc9f4e9
azcopy copy dist/* "https://stfretboard.blob.core.windows.net/$web" --recursive
```

## ARM Template
ARM Template was created by:
- first manaully creating the environment using the Portal.
- From resource view Export all the resources for the group
- Following examples from the [Quick Start Templates](https://azure.microsoft.com/en-us/resources/templates/) cut out the bits I don't need
- Use [Azure Resource Explorer](https://resources.azure.com) to get further information what wasn't included in the export, such as `appSettings` & `siteAuthSettings`.

[AzureDeploy.json](/azuredeploy.json)  
[AzureDeploy-parameters.json](/azuredeploy-parameters.json)

## Deployment Instuctions
1. In Azure Active Directory create an App Registration. Make a note of the appId. Specify this as the `aadClientId` parameter.
```
az ad sp create-for-rbac --name https://aad-fretboard
```
2. Update (the Azure Deploy Paramters file)[/azuredeploy-parameters.json]
3. Navigate CMD to the repo root
```
SET rg=rg-fretboard
az login
az group create --location uksouth --name %rg%
az deployment group create --resource-group=%rg% --template-file azuredeploy.json  --parameters @azuredeploy-parameters.json
```
4. Allow implict grant flow
This can't be done via the CLI yest so go into the portal and allow Implicit Grant for both Access Tokens and ID tokens. :(

5. 
Create a static website on the storage account
```
az storage blob service-properties update --account-name <<storage account name>> --static-website  --index-document index.html --404-document 404.html
```

6. Make a note of the web endpoint and update the AAD App Reg to use this as a Redirect URI
```
az storage account show -n stfretboard1 --query "primaryEndpoints.web" --output tsv
az ad app update --id 3408b8f5-98d2-42ad-8d31-f8fdcfabbc0a --add replyUrls "https://stfretboard1.z33.web.core.windows.net/"
```
TODO - In the function app need to add Allow Token Audience
TODO - something isn't working - users are being allowed to sign in but claims not coming through to the app.  Erm config settings ar enot being set? Storage not configured for Func App????
TODO - Does Token Store need to be On on the function app?
TODO - Add AAD RedirectUrl to Function app url
TODO - Add AAD API Permission to Microsoft.Graph User.Read
TODO - Function Apps Allowed Token Audience needs to be the same as AAD Application ID URI
TODO - Do I need to set a Client Secret?
TODO - Grant admin user Blob Contributor role to the Storage Account
TODO - CORS is wrong. Need to work out what the URL is first before I set it in the ARM template
TODO - The AD stuff is one time and fiddly to do using the CLI. So just mnaully creatr th App Registration before hand.


7. Deploy .NET application (Just publish from Visual Studio for now)

8. Deploy static website (just use azcopy for now - steps above)


## MSAL
To authenticate in a SPA use MSAL.js
```
login(): void{
    var self = this;

    let msalLogin = new Msal.UserAgentApplication({
      auth:{
        clientId: "95f851f6-de0f-4dae-9d39-4b0fc90dc6b1",
        redirectUri: "https://localhost:8080/",
        postLogoutRedirectUri: "https://localhost:8080/",
        authority: "https://login.microsoftonline.com/a061aca6-27f7-48ab-81c8-172f7bc9f4e9"
      }
    });

    var auth = msalLogin.loginPopup({
    scopes: ["User.ReadWrite", "https://fn-fretboard2.azurewebsites.net/user_impersonation"]
    })
    .then(function(loginResponse){
      //login success
      
      msalLogin.acquireTokenSilent({
        scopes: ["https://fn-fretboard2.azurewebsites.net/user_impersonation"]
      })
      .then(function(accessTokenResponse){
        let accessToken = accessTokenResponse.accessToken;
        debugger;
      })
    }).catch(function (error) {
      //login failure
      console.log(error);
      debugger;
    });
  }
}
```
note: the `https://fn-fretboard2.azurewebsites.net/user_impersonation` scope can be found in the ADD App > 'Expose an API'.

# Giving users access to the application
I didn't need to do this in my case. Every Azure subscription gets a free Active Directory (TenantId) so I'm happy that any user in my subscription automatically gets access to the app. If I wanted to assign users to the App these are the steps I'd take.
- From AAD > App registrations > go to the ADD App > Overview page go to 'Managed application in local directory' (Or Azure Active Directory > Enterprise Applications)
- This goes to the Enterprise Application
- Properties > User assignment required? Yes
- I would create an AD group and assign this group to the App however my AD plan doesn't allow group assignment.
- In the meantime just would manually add the users as needed or create an app to sync using Graph


When creating the Function .NET Core code ensure the function is set to be anonymous `[HttpTrigger(AuthorizationLevel.Anonymous...` 
