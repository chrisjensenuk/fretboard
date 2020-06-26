using Microsoft.Azure.Cosmos.Table;
using System;

namespace FretboardFunctions.TableEntities
{
    public class Answer : TableEntity
    {
        public int FretNo { get; set; }
        public int StringNo { get; set; }
        public string Note { get; set; }
        public int Attempts { get; set; }
        public int TimeTaken { get; set; }
        public string UserId { get; set; }
        public string ClientIp { get; set; }
        public DateTime InsertedOn { get; set; }
    }
}
