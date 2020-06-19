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
    public static class AnswerPost
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
        [FunctionName("answer")]
        public static async Task<IActionResult> RunAsync(
            [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
            [Table("answer")] CloudTable guessTable,
            ILogger log)
        {
            //todo: save ip address & a unique session id (created client side on page load)
            //if user is logged in then save agsitn the user's cn
            
            var body = await new StreamReader(req.Body).ReadToEndAsync();
            var answerDto = System.Text.Json.JsonSerializer.Deserialize<AnswerDto>(body);

            var answer = new Answer
            {
                PartitionKey = answerDto.UserId,
                RowKey = answerDto.Date,
                FretNo = answerDto.FretNo,
                StringNo = answerDto.StringNo,
                Attempts = answerDto.Attempts,
                TimeTaken = answerDto.TimeTaken
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
