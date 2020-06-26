using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.IO;
using FretboardFunctions.TableEntities;
using FretboardFunctions.Entities;
using Microsoft.Azure.Cosmos.Table;
using System.Security.Claims;
using System.Linq;
using System;

namespace FretboardFunctions
{
    public static class AnswerPost
    {
        [FunctionName("answer")]
        public static async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = null)] HttpRequest req,
            [Table("answer", Connection = "TableStorageConnection")] CloudTable guessTable,
            ILogger log,
            ClaimsPrincipal claimsPrincipal)
        {
#if DEBUG
            claimsPrincipal = await OpenIdConnectLocal.GetClaimsPrincipal(req);
            req.Headers.Add("X-Forwarded-For", "192.168.0.1:123456");
#endif

            var body = await new StreamReader(req.Body).ReadToEndAsync();
            var answerDto = System.Text.Json.JsonSerializer.Deserialize<AnswerDto>(body);

            string userId = null;
            
            if (claimsPrincipal.Identity.IsAuthenticated)
            {
                userId = claimsPrincipal.Claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value;
            }

            var clientIp = (req.Headers["X-Forwarded-For"].FirstOrDefault() ?? "").Split(':').FirstOrDefault();

            var now = DateTime.UtcNow;

            var answer = new Answer
            {
                PartitionKey = userId ?? now.ToString("yyyy-MM-dd"),
                RowKey = now.ToString("o"),
                ClientIp = clientIp,
                FretNo = answerDto.fretNo,
                StringNo = answerDto.stringNo,
                Note = answerDto.note,
                Attempts = answerDto.attempts,
                TimeTaken = answerDto.timeTaken,
                InsertedOn = now
            };

            try
            {
                var op = TableOperation.Insert(answer);
                await guessTable.ExecuteAsync(op);
            }
            catch(StorageException ex)
            {
                if(ex.RequestInformation?.HttpStatusCode == 409)
                {
                    log.LogInformation("Answer already inserted. Post has been ignored");
                }
                else
                {
                    throw;
                }
            }

            return new OkResult();
        }
    }
}
