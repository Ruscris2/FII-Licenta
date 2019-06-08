using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Controllers.DTOs
{
    public class PhotoSearchDTO
    {
        public string NameFilter { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int MinRating { get; set; }
        public int MaxRating { get; set; }
    }
}
