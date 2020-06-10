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

## todo 
- Create a Scope for the app.





When creating the Function .NET Core code ensure the function is set to be anonymous `[HttpTrigger(AuthorizationLevel.Anonymous...` 
