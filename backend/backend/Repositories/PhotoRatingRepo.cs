using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using backend.Models;
using backend.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class PhotoRatingRepo : IPhotoRatingRepo
    {
        private readonly DatabaseContext dbContext;
        private readonly DbSet<PhotoRating> photoRatings;

        public PhotoRatingRepo(DatabaseContext context)
        {
            dbContext = context;
            photoRatings = dbContext.Set<PhotoRating>();
        }

        public async Task<Tuple<bool, string>> Add(PhotoRating photoRating)
        {
            try
            {
                await photoRatings.AddAsync(photoRating);
                await dbContext.SaveChangesAsync();
            }
            catch
            {
                return Tuple.Create(false, "Unexpected error while adding a new photo entry!");
            }

            return Tuple.Create(true, "");
        }

        public PhotoRating GetById(int id)
        {
            PhotoRating photoRating = (from p in dbContext.PhotoRatings
                where p.Id == id
                select p).FirstOrDefault();

            return photoRating;
        }

        public List<PhotoRating> GetRatingsForPhoto(int photoId)
        {
            return (from p in dbContext.PhotoRatings where p.PhotoId == photoId select p).ToList();
        }

        public PhotoRating IsRatedBy(int accountId, int photoId)
        {
            PhotoRating photoRating = (from p in dbContext.PhotoRatings
                where p.AccountId == accountId && p.PhotoId == photoId
                select p).FirstOrDefault();

            return photoRating;
        }

        public async Task Update(PhotoRating photoRating)
        {
            photoRatings.Update(photoRating);
            await dbContext.SaveChangesAsync();
        }
    }
}
