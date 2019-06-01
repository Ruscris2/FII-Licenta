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
using Microsoft.AspNetCore.Razor.Language.Intermediate;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Newtonsoft.Json;
using RestSharp;

namespace backend.Controllers
{
    [Route("photo")]
    public class PhotoController : Controller
    {
        private readonly IAccountRepo _accountRepo;
        private readonly IPhotoRepo _photoRepo;
        private readonly IPhotoRatingRepo _photoRatingsRepo;
        private readonly IPhotoCommentRepo _photoCommentRepo;

        public PhotoController(IAccountRepo accountRepo, IPhotoRepo photoRepo, IPhotoRatingRepo photoRatingRepo, IPhotoCommentRepo photoCommentRepo)
        {
            _accountRepo = accountRepo;
            _photoRepo = photoRepo;
            _photoRatingsRepo = photoRatingRepo;
            _photoCommentRepo = photoCommentRepo;
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
                        photoEntry.RatingsCount = photo.RatingsCount;
                        photoEntry.ServerFilePath = photo.ServerFilePath;
                        photoEntry.ServerThumbFilePath = photo.ServerThumbFilePath;
                        photoEntry.TimeAdded = photo.TimeAdded;
                        response.Add(photoEntry);
                    }
                    return Ok(response);
                }
                else
                    ModelState.AddModelError("", "Photo owner doesn't exist!");
            }

            return BadRequest(ModelState.Values.SelectMany(v => v.Errors));
        }

        [Authorize]
        [HttpPost]
        [Route("single")]
        public IActionResult GetSinglePhoto([FromBody] PhotoSingleDTO dto)
        {
            Photo photo = _photoRepo.GetById(dto.Id);
            
            PhotoDTO response = new PhotoDTO();
            response.Name = photo.Name;
            response.Description = photo.Description;
            response.Id = photo.Id;
            response.OwnerId = photo.OwnerId;
            response.Rating = photo.Rating;
            response.RatingsCount = photo.RatingsCount;
            response.ServerFilePath = photo.ServerFilePath;
            response.ServerThumbFilePath = photo.ServerThumbFilePath;
            response.TimeAdded = photo.TimeAdded;

            return Ok(response);
        }

        [Authorize]
        [HttpPut]
        [Route("single")]
        public async Task<IActionResult> EditSinglePhoto([FromBody] EditPhotoDetailsDTO dto)
        {
            Photo photo = _photoRepo.GetById(dto.Id);

            photo.Name = dto.Name;
            photo.Description = dto.Description;

            await _photoRepo.Update(photo);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("rate")]
        public async Task<IActionResult> RatePhoto([FromBody] RatePhotoDTO dto)
        {
            // Check if there is already a rating on the photo for this user. If so, modify the rating
            var username = HttpContext.User.Identity.Name;
            Account raterAccount = _accountRepo.GetByIdentifier(username);

            PhotoRating photoRating = _photoRatingsRepo.IsRatedBy(raterAccount.Id, dto.PhotoId);
            if (photoRating != null)
            {
                photoRating.Value = dto.Value;
                await _photoRatingsRepo.Update(photoRating);
            }
            else
            {
                // User hasn't rated this photo before, create a new entry
                PhotoRating rating = new PhotoRating();
                rating.AccountId = raterAccount.Id;
                rating.PhotoId = dto.PhotoId;
                rating.Value = dto.Value;
                await _photoRatingsRepo.Add(rating);
            }
            
            // Now calculate the new rating
            List<PhotoRating> ratings = _photoRatingsRepo.GetRatingsForPhoto(dto.PhotoId);
            float newRating = 0.0f;
            foreach (var rating in ratings)
                newRating += rating.Value;

            newRating /= ratings.Count;

            // Apply the rating on the photo
            Photo photo = _photoRepo.GetById(dto.PhotoId);
            photo.Rating = newRating;
            photo.RatingsCount = ratings.Count;
            await _photoRepo.Update(photo);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("comment")]
        public async Task<IActionResult> CommentPhoto([FromBody] CommentPhotoDTO dto)
        {
            var username = HttpContext.User.Identity.Name;
            Account commenterAccount = _accountRepo.GetByIdentifier(username);

            PhotoComment comment = new PhotoComment();
            comment.PhotoId = dto.PhotoId;
            comment.AccountId = commenterAccount.Id;
            comment.Text = dto.Text;
            comment.TimeAdded = DateTime.Now;

            await _photoCommentRepo.Add(comment);

            return Ok();
        }

        [Authorize]
        [HttpPost]
        [Route("commentlist")]
        public IActionResult GetCommentsForPhoto([FromBody] CommentListDTO dto)
        {
            List<PhotoComment> comments = _photoCommentRepo.GetCommentsForPhoto(dto.PhotoId);

            List<CommentDTO> output = new List<CommentDTO>();

            foreach (var comment in comments)
            {
                CommentDTO entry = new CommentDTO();

                entry.Author = _accountRepo.GetById(comment.AccountId).Username;
                entry.Text = comment.Text;
                entry.TimeAdded = comment.TimeAdded;

                output.Add(entry);
            }

            return Ok(output);
        }

        [Authorize]
        [HttpGet]
        [Route("latest")]
        public IActionResult GetLatestPhotos()
        {
            List<Photo> photos = _photoRepo.GetLatestPhotos();

            List<PhotoDTO> response = new List<PhotoDTO>();
            foreach (Photo photo in photos)
            {
                PhotoDTO photoEntry = new PhotoDTO();
                photoEntry.Name = photo.Name;
                photoEntry.Description = photo.Description;
                photoEntry.Id = photo.Id;
                photoEntry.OwnerId = photo.OwnerId;
                photoEntry.Rating = photo.Rating;
                photoEntry.RatingsCount = photo.RatingsCount;
                photoEntry.ServerFilePath = photo.ServerFilePath;
                photoEntry.ServerThumbFilePath = photo.ServerThumbFilePath;
                photoEntry.TimeAdded = photo.TimeAdded;
                response.Add(photoEntry);
            }

            return Ok(response);
        }

        [Authorize]
        [HttpGet]
        [Route("mostrated")]
        public IActionResult GetMostRatedPhotos()
        {
            List<Photo> photos = _photoRepo.GetMostRatedPhotos();

            List<PhotoDTO> response = new List<PhotoDTO>();
            foreach (Photo photo in photos)
            {
                PhotoDTO photoEntry = new PhotoDTO();
                photoEntry.Name = photo.Name;
                photoEntry.Description = photo.Description;
                photoEntry.Id = photo.Id;
                photoEntry.OwnerId = photo.OwnerId;
                photoEntry.Rating = photo.Rating;
                photoEntry.RatingsCount = photo.RatingsCount;
                photoEntry.ServerFilePath = photo.ServerFilePath;
                photoEntry.ServerThumbFilePath = photo.ServerThumbFilePath;
                photoEntry.TimeAdded = photo.TimeAdded;
                response.Add(photoEntry);
            }

            return Ok(response);
        }
    }
}
