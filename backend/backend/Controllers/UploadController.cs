using System;
using System.Linq;
using System.Threading.Tasks;
using backend.Controllers.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp;

namespace backend.Controllers
{
    [Route("upload")]
    public class UploadController : Controller
    {
        private readonly IAccountRepo _accountRepo;
        private readonly IPhotoRepo _photoRepo;

        public UploadController(IAccountRepo accountRepo, IPhotoRepo photoRepo)
        {
            _accountRepo = accountRepo;
            _photoRepo = photoRepo;
        }

        [Authorize]
        [HttpGet]
        public IActionResult RequestUpload()
        {
            RestClient client = new RestClient("http://localhost:5001");

            RestRequest request = new RestRequest("file", Method.GET);

            IRestResponse response = client.Execute(request);
            UploadRequestDTO result = JsonConvert.DeserializeObject<UploadRequestDTO>(response.Content);

            return Ok(new {key = result.key});
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> UploadComplete([FromBody] UploadCompleteDTO dto)
        {
            // Check if model state is valid
            if (ModelState.IsValid)
            {
                // Check if target user exists in database
                Tuple<Account, string> acc = _accountRepo.GetByIdentifier(dto.username);
                if (acc.Item1 == null)
                    ModelState.AddModelError("", "Username doesn't exist!");
                else
                {
                    bool operationStatus = true;

                    // Try and add an entry for each photo in database
                    foreach (UploadedFileInfo file in dto.files)
                    {
                        Photo photo = new Photo();
                        photo.Name = file.filename;
                        photo.ServerFilePath = file.filepath;
                        photo.OwnerId = acc.Item1.Id;
                        photo.TimeAdded = DateTime.Now;

                        Tuple<bool, string> result = await _photoRepo.Add(photo);

                        // If atleast one photo fails to be added to database, emit BadRequest response
                        if (result.Item1 == false)
                        {
                            operationStatus = false;
                            ModelState.AddModelError("", result.Item2);
                            break;
                        }
                    }

                    if(operationStatus)
                        return Ok();
                }   
            }

            return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
        }
    }
}
