using System;
using System.Collections.Generic;
using System.Text;

namespace backend.Controllers.DTOs
{
    public class EditPhotoDetailsDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
