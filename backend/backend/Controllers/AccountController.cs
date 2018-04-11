
using backend.Controllers.DTOs;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("account")]
    public class AccountController : Controller
    {
        private readonly IAccountRepo _accountRepo;

        public AccountController(IAccountRepo accountRepo)
        {
            _accountRepo = accountRepo;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] RegisterDTO dto)
        {
            // Check if json is valid
            if(ModelState.IsValid)
            {
                Account newAccount = new Account();
                newAccount.FirstName = dto.FirstName;
                newAccount.LastName = dto.LastName;
                newAccount.Username = dto.Username;
                newAccount.Email = dto.Email;
                newAccount.Password = dto.Password;

                // Optional fields (those might be null)
                newAccount.Address = dto.Address;
                newAccount.Country = dto.Country;
                newAccount.City = dto.City;
                newAccount.ZipCode = dto.ZipCode;


                // Attempt to create a new account
                Tuple<bool, string> result = await _accountRepo.Add(newAccount);

                // If sucessful, return ok, else add error to model and return bad request
                if(result.Item1)
                    return Ok();
                
                ModelState.AddModelError("", result.Item2);
            }

            return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
        }

        [Authorize]
        [HttpGet]
        public IActionResult AccountInfo()
        {
            var username = HttpContext.User.Identity.Name;

            Tuple<Account, string> result = _accountRepo.GetByIdentifier(username);
            
            return Ok(new { username = result.Item1.Username, email = result.Item1.Email });
        }
    }
}
