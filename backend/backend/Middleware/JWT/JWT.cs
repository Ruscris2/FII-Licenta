
using backend.Models;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace backend.Middleware.JWT
{
    public class JWT
    {
        private const string _secret = "bGljZW50YS1maWktMjAxOA==";

        public static SecurityToken GenerateToken(Account account, int expirationMinutes = 900)
        {
            byte[] key = Convert.FromBase64String(_secret);
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();

            SecurityTokenDescriptor securityDescriptor = new SecurityTokenDescriptor();
            securityDescriptor.Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, account.Username),
                new Claim(ClaimTypes.Email, account.Email)
            });
            securityDescriptor.Expires = DateTime.UtcNow.AddMinutes(expirationMinutes);
            securityDescriptor.SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature);
            securityDescriptor.Issuer = "FIILicense";
            securityDescriptor.Audience = "FIILicense";

            return tokenHandler.CreateToken(securityDescriptor);
        }
    }
}
