using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Security.Cryptography;
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

        public Photo LatestPhotoOfUser(int ownerId)
        {
            Photo photo = (from p in dbContext.Photos
                where p.OwnerId == ownerId
                orderby p.TimeAdded descending
                select p).FirstOrDefault();

            return photo;
        }

        public List<Photo> GetPhotoList(int ownerId, int page, int entriesPerPage, string nameFilter)
        {
            IQueryable<Photo> photoQuery;

            if (nameFilter == null)
            {
                photoQuery = (from p in dbContext.Photos
                    where p.OwnerId == ownerId
                    select p).Skip((page - 1) * entriesPerPage).Take(entriesPerPage);
            }
            else
            {
                photoQuery = (from p in dbContext.Photos
                    where p.OwnerId == ownerId && p.Name.Contains(nameFilter)
                    select p).Skip((page - 1) * entriesPerPage).Take(entriesPerPage);
            }
           
            return photoQuery.ToList();
        }

        public List<Photo> GetLatestPhotos()
        {
            return (from p in dbContext.Photos orderby p.TimeAdded descending select p).Take(8).ToList();
        }

        public List<Photo> GetMostRatedPhotos()
        {
            return (from p in dbContext.Photos orderby p.Rating descending select p).Take(8).ToList();
        }

        public List<Photo> GetAllPhotos(string nameFilter, DateTime startDate, DateTime endDate, int minRating, int maxRating)
        {
            List<Photo> output;

            if (nameFilter == "")
            {
                output = (from p in dbContext.Photos
                    where p.TimeAdded >= startDate && p.TimeAdded <= endDate && p.Rating >= minRating
                          && p.Rating <= maxRating
                    orderby p.TimeAdded descending
                    select p).ToList();
            }
            else
            {
                output = (from p in dbContext.Photos
                    where p.TimeAdded >= startDate && p.TimeAdded <= endDate && p.Rating >= minRating
                          && p.Rating <= maxRating && p.Name.Contains(nameFilter)
                    orderby p.TimeAdded descending
                    select p).ToList();
            }

            return output;
        }

        public async Task Update(Photo photo)
        {
            photos.Update(photo);
            await dbContext.SaveChangesAsync();
        }
    }
}
