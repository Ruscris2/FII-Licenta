using System.ComponentModel.DataAnnotations;

namespace backend.Controllers.DTOs
{
    public class PhotoListDTO
    {
        [Required]
        public int Page { get; set; } 

        [Required]
        public int EntriesPerPage { get; set; }

        public string NameFilter { get; set; }
    }
}
