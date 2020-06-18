# Authentication

I want the SPA frontend to be able to talk to Azure functions securely.  The user will log in to Azure AD and call the functions using a Bearer token.  The functions can be called with or without the user being authenticated.

## Client Id vs Application ID URI
I was getting confused between the difference between the App's client Id and its Application ID URL as they both uniquely identify an AAD App Registration.
From what I can tell the client_Id is the identifier of the client app that will be requesting access tokens.  The Application ID URL is the identifier of the resource being requested.

## Token Store
App Service > Authentication / Authorization > Advanced Settings > Token Store
For the time being this doesn't need to be tunred on.  Example if the user authenticated with Facebook and the app wanted to make posts to the Facebook API on behalf of the user. Then access token required to do with will be automatically stored in the Token Store if this feature was enabled.

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
note: the `https://fn-fretboard2.azurewebsites.net/user_impersonation` scope can be found in the Function App's ADD App Registration > 'Expose an API'.

# Giving users access to the application
I didn't need to do this in my case. Every Azure subscription gets a free Active Directory (TenantId) so I'm happy that any user in my subscription automatically gets access to the app. If I wanted to assign users to the App these are the steps I'd take.
- From AAD > App registrations > go to the ADD App > Overview page go to 'Managed application in local directory' (Or Azure Active Directory > Enterprise Applications)
- This goes to the Enterprise Application
- Properties > User assignment required? Yes
- I would create an AD group and assign this group to the App however my AD plan doesn't allow group assignment.
- In the meantime just would manually add the users as needed or create an app to sync using Graph

When creating the Function .NET Core code ensure the function is set to be anonymous `[HttpTrigger(AuthorizationLevel.Anonymous...` 

# Local Debugging
- Add `https://localhost:8080/` to the ADD `freetboard_web` Redirect URIs.  

So it appears that running Functions locally (F5) using `Azure Functions Core Tools`. Doesn't do ANY authentication including population of the claims passed in by the AAD bearer token.  Its just sets a default claim `http://schemas.microsoft.com/2017/07/functions/claims/authlevel=Admin`. So local debugging of auth just doesn't work!
[see line in GitHub](https://github.com/Azure/azure-functions-core-tools/blob/b2157d366244c7a72f208261ba8d3c5acbda8f81/src/Azure.Functions.Cli/Actions/HostActions/WebHost/Security/CliAuthenticationHandler.cs#L25)

https://cmatskas.com/create-an-azure-ad-protected-api-using-azure-functions-and-net-core-3-1/


## Next Steps
- ~~Create 2 AAD App Registrations~~
- ~~Make sure environment creation steps work. I want to be able to tear down and recreate the environment quickly.  I'll need a mix of ARM and manaul Portal tweaking~~
- Have a play with Pulumi
- Improve MSAL.js calling code
- Explore B2C for user self service.


