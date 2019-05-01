using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Controllers.DTOs
{
    public class CommentDTO
    {
        public string Author { get; set; }
        public string Text { get; set; }
        public DateTime TimeAdded { get; set; }
    }
}
