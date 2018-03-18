
using backend.Controllers.DTOs;
using backend.Middleware.JWT;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("token")]
    public class TokenController : Controller
    {
        private readonly IAccountRepo _accountRepo;

        public TokenController(IAccountRepo accountRepo)
        {
            _accountRepo = accountRepo;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginDTO dto)
        {
            // Check if json is valid
            if(ModelState.IsValid)
            {
                // Get the account
                Tuple<Account, string> result = _accountRepo.GetByIdentifier(dto.AccountIdentifier);
                if (result.Item1 != null)
                {
                    // Hash the login password using SHA256
                    byte[] bytes = Encoding.UTF8.GetBytes(dto.Password);
                    SHA256Managed cipher = new SHA256Managed();
                    byte[] hash = cipher.ComputeHash(bytes);

                    // Digest the hash
                    dto.Password = "";
                    foreach (byte b in hash)
                        dto.Password += string.Format("{0:x2}", b);

                    // Check if the password matches
                    if(dto.Password == result.Item1.Password)
                    {
                        // Create the JWT Token
                        SecurityToken token = JWT.GenerateToken(result.Item1);
                        return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
                    }
                    else
                        ModelState.AddModelError("", "Invalid account identifier and/or password!");
                }
                else
                    ModelState.AddModelError("", "Invalid account identifier and/or password!");
            }

            return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
        }
    }
}
