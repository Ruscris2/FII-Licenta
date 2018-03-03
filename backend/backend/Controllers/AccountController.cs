
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Mvc;
using System;
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

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            return Ok(await accountRepo.GetAll());
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Account dto)
        {
            Console.WriteLine("ID: " + dto.Id + " USER: " + dto.Username + " EMAIL: " + dto.Email);
            await accountRepo.Add(dto);
            return Ok();
        }
    }
}
