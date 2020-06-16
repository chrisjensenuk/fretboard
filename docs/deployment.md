## Deployment Instuctions
1. In Azure Active Directory create an App Registration. Make a note of the appId. Specify this as the `aadClientId` parameter.
```
az ad sp create-for-rbac --name https://aad-fretboard
```
2. Update (the Azure Deploy Paramters file)[/azuredeploy-parameters.json]
3. Navigate CMD to the repo root
```
SET rg=rg-fretboard
SET loc=uksouth
az login
az group create --location uksouth --name %rg%
az deployment group create --resource-group=%rg% --template-file azuredeploy.json  --parameters @azuredeploy-parameters.json --parameters location=%loc%
```
4. Allow implict grant flow
This can't be done via the CLI yest so go into the portal and allow Implicit Grant for both Access Tokens and ID tokens. :(

5. 
Create a static website on the storage account
```
az storage blob service-properties update --account-name <<storage account name>> --static-website  --index-document index.html --404-document 404.html
```

6. Make a note of the web endpoint and update the AAD App Reg to use this as a Redirect URI

7. Function Apps Allowed Token Audience needs to be the same as AAD Application ID URI.  The Application ID URI identifies the resource being requested so it makes sense that it should be the same as the Function Apps base URL (although it doesn't need to be!). Make sure the same value is also used in the Function App's AAD 'Allowed Token Audiences'.

```
az storage account show -n stfretboard1 --query "primaryEndpoints.web" --output tsv
az ad app update --id 3408b8f5-98d2-42ad-8d31-f8fdcfabbc0a --add replyUrls "https://stfretboard1.z33.web.core.windows.net/"
```

7. Deploy .NET application (Just publish from Visual Studio for now)

8. Deploy static website (just use azcopy for now - steps above)


- ~~TODO - In the function app need to add Allow Token Audience~~
- ~~TODO - Function Apps Allowed Token Audience needs to be the same as AAD Application ID URI~~
- ~~TODO - Does Token Store need to be On on the function app?~~
- TODO - Add AAD RedirectUrl to Function app url
- TODO - Add AAD API Permission to Microsoft.Graph User.Read
- ~~TODO - Do I need to set a Client Secret?~~
- TODO - Investigate Pulumi
- TODO - Grant admin user Blob Contributor role to the Storage Account
- TODO - CORS is wrong. Need to work out what the URL is first before I set it in the ARM template
- TODO - The AD stuff is one time and fiddly to do using the CLI. So just mnaully creatr th App Registration before hand.