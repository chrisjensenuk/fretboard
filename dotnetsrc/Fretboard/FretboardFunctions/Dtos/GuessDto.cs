using System;

namespace FretboardFunctions.Entities
{
    public class GuessDto
    {
        public string UserId { get; set; }
        public string Date { get; set; }
        public int FretNo { get; set; }
        public int StringNo { get; set; }
        public int Attempts { get; set; }
        public int TimeTaken { get; set; }
    }
}
