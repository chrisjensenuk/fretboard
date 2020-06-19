using Microsoft.Azure.Cosmos.Table;

namespace FretboardFunctions.TableEntities
{
    public class Answer : TableEntity
    {
        public int FretNo { get; set; }
        public int StringNo { get; set; }
        public int Attempts { get; set; }
        public int TimeTaken { get; set; }
    }
}
