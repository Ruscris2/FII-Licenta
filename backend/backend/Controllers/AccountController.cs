
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
                Tuple<Account, string> result = _accountRepo.GetByIdentifier(username);

                if (dto.FirstName != null)
                    result.Item1.FirstName = dto.FirstName;
                if (dto.LastName != null)
                    result.Item1.LastName = dto.LastName;
                if (dto.Country != null)
                    result.Item1.Country = dto.Country;
                if (dto.City != null)
                    result.Item1.City = dto.City;
                if (dto.Address != null)
                    result.Item1.Address = dto.Address;
                if (dto.ZipCode != null)
                    result.Item1.ZipCode = dto.ZipCode;

                await _accountRepo.Update(result.Item1);

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
            Tuple<Account, string> result = _accountRepo.GetByIdentifier(username);
            
            return Ok(new
            { username = result.Item1.Username,
              email = result.Item1.Email,
              firstName = result.Item1.FirstName,
              lastName = result.Item1.LastName,
              address = result.Item1.Address,
              country = result.Item1.Country,
              city = result.Item1.City,
              zipcode = result.Item1.ZipCode
            });
        }
    }
}
