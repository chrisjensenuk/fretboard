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

namespace FretboardFunctions
{
    public static class GuessPost
    {
        /*
        {
	        "UserId" : "userid",
	        "Date" : "2020-08-08T15:39",
	        "FretNo" : 0,
	        "StringNo" : 0,
	        "Attempts" : 1,
	        "TimeTaken" : 1234
        }
        */
        [FunctionName("guess")]
        public static async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            [Table("guess")] CloudTable guessTable,
            ILogger log)
        {

            var body = await new StreamReader(req.Body).ReadToEndAsync();
            var guessDto = System.Text.Json.JsonSerializer.Deserialize<GuessDto>(body);

            var guess = new Guess
            {
                PartitionKey = guessDto.UserId,
                RowKey = guessDto.Date,
                FretNo = guessDto.FretNo,
                StringNo = guessDto.StringNo,
                Attempts = guessDto.Attempts,
                TimeTaken = guessDto.TimeTaken
            };

            try
            {
                var op = TableOperation.Insert(guess);
                await guessTable.ExecuteAsync(op);
            }
            catch(StorageException ex)
            {
                if(ex.RequestInformation?.HttpStatusCode == 409)
                {
                    log.LogInformation("Guess already inserted. Post has been ignored");
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
