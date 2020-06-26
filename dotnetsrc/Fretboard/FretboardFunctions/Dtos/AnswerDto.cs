using System;

namespace FretboardFunctions.Entities
{
    public class AnswerDto
    {
        public int fretNo { get; set; }
        public int stringNo { get; set; }
        public string note { get; set; }
        public int attempts { get; set; }
        public int timeTaken { get; set; }
    }
}
