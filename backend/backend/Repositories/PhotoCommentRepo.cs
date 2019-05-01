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
    public class PhotoCommentRepo : IPhotoCommentRepo
    {
        private readonly DatabaseContext dbContext;
        private readonly DbSet<PhotoComment> photoComments;

        public PhotoCommentRepo(DatabaseContext context)
        {
            dbContext = context;
            photoComments = dbContext.Set<PhotoComment>();
        }

        public async Task<Tuple<bool, string>> Add(PhotoComment photoComment)
        {
            try
            {
                await photoComments.AddAsync(photoComment);
                await dbContext.SaveChangesAsync();
            }
            catch
            {
                return Tuple.Create(false, "Unexpected error while adding a new photo comment entry!");
            }

            return Tuple.Create(true, "");
        }

        public List<PhotoComment> GetCommentsForPhoto(int photoId)
        {
            return (from p in dbContext.PhotoComments where p.PhotoId == photoId select p).ToList();
        }
    }
}
