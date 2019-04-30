using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace backend.Models
{
    public class PhotoRating
    {
        [Required, Key]
        public int Id { get; set; }

        [Required]
        public int PhotoId { get; set; }

        [Required]
        public int AccountId { get; set; }

        [Required]
        public int Value { get; set; }
    }
}
