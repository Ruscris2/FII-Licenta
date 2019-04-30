using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IPhotoRatingRepo
    {
        Task<Tuple<bool, string>> Add(PhotoRating photoRating);
        PhotoRating GetById(int id);
        PhotoRating IsRatedBy(int accountId, int photoId);
        List<PhotoRating> GetRatingsForPhoto(int photoId);
        Task Update(PhotoRating photoRating);
    }
}
