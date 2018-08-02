
using System;
using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Photo
    {
        [Required, Key]
        public int Id { get; set; }

        [Required]
        public int OwnerId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string ServerFilePath { get; set; }

        [Required]
        public DateTime TimeAdded { get; set; }

        public string Description { get; set; }
    }
}
