using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IPhotoRepo
    {
        Task<Tuple<bool, string>> Add(Photo photo);
        Photo GetById(int id);
        List<Photo> GetPhotoList(int ownerId, int page, int entriesPerPage, string nameFilter);
        List<Photo> LatestPhotosOfUser(int ownerId, int count);
        List<Photo> GetLatestPhotos();
        List<Photo> GetMostRatedPhotos();
        List<Photo> GetAllPhotos(string nameFilter, DateTime startDate, DateTime endDate, int minRating, int maxRating);
        Task Update(Photo photo);
    }
}
