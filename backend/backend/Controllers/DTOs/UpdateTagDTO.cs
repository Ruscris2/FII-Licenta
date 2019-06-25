using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Controllers.DTOs
{
    public class UpdateTagDTO
    {
        public int PhotoId { get; set; }
        public string Tags { get; set; }
    }
}
