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