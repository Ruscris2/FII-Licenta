
using System.ComponentModel.DataAnnotations;

namespace backend.Controllers.DTOs
{
    public class LoginDTO
    {
        [Required, MaxLength(64)]
        public string AccountIdentifier { get; set; }

        [Required, MaxLength(64), MinLength(6)]
        public string Password { get; set; }

    }
}
