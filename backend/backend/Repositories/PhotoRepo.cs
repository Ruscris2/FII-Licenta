using System;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using backend.Repositories.Interfaces;

namespace backend.Repositories
{
    public class PhotoRepo : IPhotoRepo
    {
        private readonly DatabaseContext dbContext;
        private readonly DbSet<Photo> photos;

        public PhotoRepo(DatabaseContext context)
        {
            dbContext = context;
            photos = dbContext.Set<Photo>();
        }

        // Logic for adding a new photo entry
        public async Task<Tuple<bool, string>> Add(Photo photo)
        {
            try
            {
                await photos.AddAsync(photo);
                await dbContext.SaveChangesAsync();
            }
            catch
            {
                return Tuple.Create(false, "Unexpected error while adding a new photo entry!");
            }

            return Tuple.Create(true, "");
        }

        // Get an account based on it's id
        public Photo GetById(int id)
        {
            Photo photo = (from p in dbContext.Photos
                            where p.Id == id
                            select p).FirstOrDefault();

            return photo;
        }

        public async Task Update(Photo photo)
        {
            photos.Update(photo);
            await dbContext.SaveChangesAsync();
        }
    }
}
