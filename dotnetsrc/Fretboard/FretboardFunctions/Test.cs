using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Security.Claims;
using System.Linq;
using System;

namespace FretboardFunctions
{
    public static class Test
    {
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
            var claims = string.Join(" | ", claimsPrincipal.Claims.Select(c => $"{c.Type}={c.Value}|"));

            var response = $"{DateTime.Now:o} :: { isAuthenticated} :: {claims}";
            
            return new OkObjectResult(response);
        }
    }
}
