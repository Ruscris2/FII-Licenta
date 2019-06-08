using System;
using System.Collections.Generic;
using System.Text;
using backend.Controllers.DTOs;
using backend.Models;
using backend.Repositories;
using backend.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("activity")]
    public class ActivityController : Controller
    {
        private readonly IAccountRepo _accountRepo;
        private readonly IPhotoRepo _photoRepo;
        private readonly IPhotoRatingRepo _photoRatingsRepo;
        private readonly IPhotoCommentRepo _photoCommentRepo;

        public ActivityController(IAccountRepo accountRepo, IPhotoRepo photoRepo, IPhotoRatingRepo photoRatingRepo, IPhotoCommentRepo photoCommentRepo)
        {
            _accountRepo = accountRepo;
            _photoRepo = photoRepo;
            _photoRatingsRepo = photoRatingRepo;
            _photoCommentRepo = photoCommentRepo;
        }

        [Authorize]
        [HttpGet]
        public IActionResult GetActivites()
        {
            List<ActivityDTO> activities = new List<ActivityDTO>();

            var username = HttpContext.User.Identity.Name;

            Account owner = _accountRepo.GetByIdentifier(username);

            // Foreach photo added create activities
            List<Photo> photos = _photoRepo.GetPhotoList(owner.Id, 1, 9999, null);
            foreach (Photo photo in photos)
            {
                List<PhotoRating> ratings = _photoRatingsRepo.GetRatingsForPhoto(photo.Id);
                List<PhotoComment> comments = _photoCommentRepo.GetCommentsForPhoto(photo.Id);

                foreach (PhotoRating rating in ratings)
                {
                    ActivityDTO activity = new ActivityDTO();
                    activity.TimeAdded = rating.TimeAdded;
                    activity.Author = _accountRepo.GetById(rating.AccountId).Username;
                    activity.TargetPhotoId = photo.Id;
                    activity.TargetPhotoName = photo.Name;
                    activity.TargetPhotoThumb = photo.ServerThumbFilePath;
                    activity.Type = "rating";
                    activities.Add(activity);
                }

                foreach (PhotoComment comment in comments)
                {
                    ActivityDTO activity = new ActivityDTO();
                    activity.TimeAdded = comment.TimeAdded;
                    activity.Author = _accountRepo.GetById(comment.AccountId).Username;
                    activity.TargetPhotoId = photo.Id;
                    activity.TargetPhotoName = photo.Name;
                    activity.TargetPhotoThumb = photo.ServerThumbFilePath;
                    activity.Type = "comment";
                    activities.Add(activity);
                }

                for(int i = 0; i < activities.Count; i++)
                    for (int j = 0; j < activities.Count; j++)
                    {
                        if (activities[i].TimeAdded > activities[j].TimeAdded)
                        {
                            ActivityDTO aux = activities[i];
                            activities[i] = activities[j];
                            activities[j] = aux;
                        }
                    }
            }

            return Ok(activities);
        }

    }
}
