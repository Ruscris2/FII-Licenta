
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers.DTOs
{
    public class RegisterDTO
    {
        [Required, MaxLength(32)]
        public string FirstName { get; set; }

        [Required, MaxLength(32)]
        public string LastName { get; set; }

        [Required, MaxLength(32)]
        public string Username { get; set; }

        [Required, MaxLength(64), EmailAddress]
        public string Email { get; set; }

        [Required, MaxLength(64), MinLength(6)]
        public string Password { get; set; }

        public string Address { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
    }
}
