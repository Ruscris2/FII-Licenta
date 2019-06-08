using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Controllers.DTOs
{
    public class ActivityDTO
    {
        public DateTime TimeAdded { get; set; }
        public string Type { get; set; }
        public int TargetPhotoId { get; set; }
        public string TargetPhotoName { get; set; }
        public string TargetPhotoThumb { get; set; }
        public string Author { get; set; }
    }
}
