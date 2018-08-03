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
        List<Photo> GetPhotoList(int ownerId, int page, int entriesPerPage);
        Task Update(Photo photo);
    }
}
