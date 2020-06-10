# Authentication

I want the SPA frontend to be able to talk to Azure functions securely.  Theuser to log in to Azure AD and call the functions using a Bearer token.  The functions can be called with or without the user being authenticated.

# Azure Setup
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
- From Azure Active Directory >  App Registrations > click the ADD App
- Optional - for local development add 'https://localhost:8080' to Redirect URIs
- I'm not using MSAL.js v2.0 (As B2C can't use it yet and I want to move to B2C) so need to Implicit grant Access tokens and ID tokens
- Save

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
I don't really need to do this in my case. Every Azure subscription gets a free Active Directory (TenantId) so I'm happy that any user in my subscription automatically gets access to the app. If I wanted to assign users to the App these are the steps I'd take.
- From AAD > App registrations > go to the ADD App > Overview page go to 'Managed application in local directory' (Or Azure Active Directory > Enterprise Applications)
- This goes to the Enterprise Application
- Properties > User assignment required? Yes
- I would create an AD group and assign this group to the App however my AD plan doesn't allow group assignment.
- In the meantime just would manually add the users as needed or create an app to sync using Graph


## todo 
- Create a Scope for the app.





When creating the Function .NET Core code ensure the function is set to be anonymous `[HttpTrigger(AuthorizationLevel.Anonymous...` 
