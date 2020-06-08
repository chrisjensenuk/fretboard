using Microsoft.Azure.Cosmos.Table;

namespace FretboardFunctions.TableEntities
{
    public class Guess : TableEntity
    {
        public int FretNo { get; set; }
        public int StringNo { get; set; }
        public int Attempts { get; set; }
        public int TimeTaken { get; set; }
    }
}
