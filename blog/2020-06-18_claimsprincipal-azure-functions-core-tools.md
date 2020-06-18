# Azure Function Core Tools, ClaimsPrincipal and Local Debugging

Date: 2020-06-18  
Versions:  
- Azure Functions Core Tools 3.0.2534
- .NET Core 3.1

Azure Functions Core Tools ignores all authorisation logic when you run Azure Functions Locally.

https://github.com/Azure/azure-functions-core-tools/blob/b2157d366244c7a72f208261ba8d3c5acbda8f81/src/Azure.Functions.Cli/Actions/HostActions/WebHost/Security/CliAuthenticationHandler.cs#L21

All injected `ClaimPrincipals` are set to be `Identity.IsAuthenticated` and have a single claim:
```
http://schemas.microsoft.com/2017/07/functions/claims/authlevel=Admin
```

As I'm attempting to use Azure Functions as my backend for my JAMStack application this makes local development really difficult as I need each user's identity and claims to be available to the Function.  In Azure this works fine, my bearer token successfully populates the `ClaimsPrincipal` that is injected into the Function signature.

So I need a way of populating the `ClaimsPricipal` when running locally and revert back to the Azure's built in mechanism when running in cloud.  This is what I came up with.

I created a class that is only availble when in `DEBUG`
```
#if DEBUG

using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;

namespace FretboardFunctions
{
    public class OpenIdConnectLocal
    {
        public static async Task<ClaimsPrincipal> GetClaimsPrincipal(HttpRequest req)
        {
            var authorizationHeader = req.Headers?["Authorization"];
            string[] parts = authorizationHeader?.ToString().Split(null) ?? new string[0];
            var jwt = (parts.Length == 2 && parts[0].Equals("Bearer")) ? parts[1] : string.Empty;

            if(string.IsNullOrEmpty(jwt))
            {
                return new ClaimsPrincipal(new ClaimsIdentity());
            }

            var jwtHandler = new JwtSecurityTokenHandler();

            var ConfigManager = new ConfigurationManager<OpenIdConnectConfiguration>(
                 $"https://login.microsoftonline.com/{Environment.GetEnvironmentVariable("DEV_TENANT_ID")}/.well-known/openid-configuration",
                 new OpenIdConnectConfigurationRetriever());
            var openIdConnectConfig = await ConfigManager.GetConfigurationAsync();

            var validationParams = new TokenValidationParameters
            {
                ValidAudience = Environment.GetEnvironmentVariable("DEV_AUDIENCE_ID_URI"),
                ValidateAudience = true,
                IssuerSigningKeys = openIdConnectConfig.SigningKeys,
                ValidIssuer = openIdConnectConfig.Issuer,
                ValidateIssuer = true
            };

            var claimsPrincipal = jwtHandler.ValidateToken(jwt, validationParams, out _);

            return claimsPrincipal;
        }
    }
}
#endif
```
Note: This is for OpenID Connect v1 (v2's configuration can be located 'https://login.microsoftonline.com/a061aca6-27f7-48ab-81c8-172f7bc9f4e9/v2.0/.well-known/openid-configuration')

Then in my Function I can call this function only when I'm running in `DEBUG`
```
[FunctionName("test")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log,
            ClaimsPrincipal claimsPrincipal)
        {
#if DEBUG
            claimsPrincipal = await OpenIdConnectLocal.GetClaimsPrincipal(req);
#endif

            var isAuthenticated = claimsPrincipal.Identity.IsAuthenticated ? "Authenticated" : "Not authenticated";

            return new OkObjectResult(isAuthenticated);
        }
```
When I'm not running in `DEBUG` the injected claimsPrincipal is used instead.  Not ideal but at least its clean when its pushed to Azure.

I needed to add 2 NuGet packages to get the Jwt and OpenID Connect libraries I needed.  Again I made their inclusion conditional on when we're running in `Debug`.  so in the .csproj...

```
  <ItemGroup Condition="'$(Configuration)' == 'Debug'">
    <PackageReference Include="Microsoft.IdentityModel.Protocols.OpenIdConnect" Version="6.6.0" />
    <PackageReference Include="System.IdentityModel.Tokens.Jwt" Version="6.6.0" />
  </ItemGroup>
```

Note: When running locally I'd get an error saying my Function couldn't find `Microsoft.IdentityModel.Protocols.OpenIdConnect.dll`.

> The 'test' function is in error: Unable to load one or more of the requested types.
> Could not load file or assembly 'Microsoft.IdentityModel.Protocols.OpenIdConnect, Version=6.6.0.0, Culture=neutral, PublicKeyToken=31bf3856ad364e35'. The system cannot find the file specified.

This is due to the Azure Functions Host being a bit overzealous when stripping out libraries that it considers are only runtime dependancies according to this thread https://github.com/Azure/Azure-Functions/issues/1525.

The fix is to add `<_FunctionsSkipCleanOutput>true</_FunctionsSkipCleanOutput>` to the .csproj file.  In my case (for the time being) I only need it to not be stripped out when I'm in `DEBUG` so I've added `<_FunctionsSkipCleanOutput Condition="'$(Configuration)' == 'Debug'">true</_FunctionsSkipCleanOutput>` instead.

