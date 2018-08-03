
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
        [HttpPut]
        public async Task<IActionResult> UpdateInfo([FromBody] UpdateDTO dto)
        {
            if (ModelState.IsValid)
            {
                // TODO: We assume that identifier is valid, might not always be the case
                var username = HttpContext.User.Identity.Name;
                Account account = _accountRepo.GetByIdentifier(username);

                if (dto.FirstName != null)
                    account.FirstName = dto.FirstName;
                if (dto.LastName != null)
                    account.LastName = dto.LastName;
                if (dto.Country != null)
                    account.Country = dto.Country;
                if (dto.City != null)
                    account.City = dto.City;
                if (dto.Address != null)
                    account.Address = dto.Address;
                if (dto.ZipCode != null)
                    account.ZipCode = dto.ZipCode;

                await _accountRepo.Update(account);

                return Ok();
            }

            return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
        }

        [Authorize]
        [HttpGet]
        public IActionResult AccountInfo()
        {
            var username = HttpContext.User.Identity.Name;

            // TODO: Check if identifier is valid, even if here it should be always valid
            Account account = _accountRepo.GetByIdentifier(username);
            
            return Ok(new
            { username = account.Username,
              email = account.Email,
              firstName = account.FirstName,
              lastName = account.LastName,
              address = account.Address,
              country = account.Country,
              city = account.City,
              zipcode = account.ZipCode
            });
        }
    }
}
