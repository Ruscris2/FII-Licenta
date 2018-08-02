using System;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IPhotoRepo
    {
        Task<Tuple<bool, string>> Add(Photo photo);
        Photo GetById(int id);
        Task Update(Photo photo);
    }
}
