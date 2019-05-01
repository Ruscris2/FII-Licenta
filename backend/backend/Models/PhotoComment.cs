using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace backend.Models
{
    public class PhotoComment
    {
        [Required, Key]
        public int Id { get; set; }

        [Required]
        public int PhotoId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [Required]
        public string Text { get; set; }

        [Required]
        public DateTime TimeAdded { get; set; }
    }
}
