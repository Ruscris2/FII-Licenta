
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers.DTOs
{
    public class RegisterDTO
    {
        [Required, MaxLength(32)]
        public string Username { get; set; }

        [Required, MaxLength(64), EmailAddress]
        public string Email { get; set; }

        [Required, MaxLength(64), MinLength(6)]
        public string Password { get; set; }

        [Required, MaxLength(64), MinLength(6)]
        [Compare("Password", ErrorMessage = "Passwords don't match.")]
        public string ConfirmPassword { get; set; }
    }
}
