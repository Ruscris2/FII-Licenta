
using backend.Controllers.DTOs;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers
{
    [Route("account")]
    public class AccountController : Controller
    {
        private readonly IAccountRepo accountRepo;

        public AccountController(IAccountRepo accountRepo)
        {
            this.accountRepo = accountRepo;
        }

        [HttpPost]
        public async Task<IActionResult> Register([FromBody] AccountDTO dto)
        {
            // Check if json is valid
            if(ModelState.IsValid)
            {
                Account newAccount = new Account();
                newAccount.Username = dto.Username;
                newAccount.Email = dto.Email;
                newAccount.Password = dto.Password;

                // Attempt to create a new account
                Tuple<bool, string> result = await accountRepo.Add(newAccount);

                // If sucessful, return ok, else add error to model and return bad request
                if(result.Item1 == true)
                    return Ok();
                else
                    ModelState.AddModelError("", result.Item2);
            }

            return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
        }
    }
}
