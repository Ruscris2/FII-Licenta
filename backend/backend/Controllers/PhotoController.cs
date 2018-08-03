using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
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
    [Route("photo")]
    public class PhotoController : Controller
    {
        private readonly IAccountRepo _accountRepo;
        private readonly IPhotoRepo _photoRepo;

        public PhotoController(IAccountRepo accountRepo, IPhotoRepo photoRepo)
        {
            _accountRepo = accountRepo;
            _photoRepo = photoRepo;
        }

        [Authorize]
        [HttpPost]
        public IActionResult PhotoList([FromBody] PhotoListDTO dto)
        {
            if (ModelState.IsValid)
            {
                var username = HttpContext.User.Identity.Name;

                Account owner = _accountRepo.GetByIdentifier(username);
                if (owner != null)
                {
                    List<Photo> photos = _photoRepo.GetPhotoList(owner.Id, dto.Page, dto.EntriesPerPage, dto.NameFilter);

                    List<PhotoDTO> response = new List<PhotoDTO>();
                    foreach (Photo photo in photos)
                    {
                        PhotoDTO photoEntry = new PhotoDTO();
                        photoEntry.Name = photo.Name;
                        photoEntry.Description = photo.Description;
                        photoEntry.Id = photo.Id;
                        photoEntry.OwnerId = photo.OwnerId;
                        photoEntry.Rating = photo.Rating;
                        photoEntry.ServerFilePath = photo.ServerFilePath;
                        photoEntry.ServerThumbFilePath = photo.ServerThumbFilePath;
                        photoEntry.TimeAdded = photoEntry.TimeAdded;
                        response.Add(photoEntry);
                    }
                    return Ok(response);
                }
                else
                    ModelState.AddModelError("", "Photo owner doesn't exist!");
            }

            return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
        }
    }
}
