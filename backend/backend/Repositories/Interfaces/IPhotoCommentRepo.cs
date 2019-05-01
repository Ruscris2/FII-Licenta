using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using backend.Models;

namespace backend.Repositories.Interfaces
{
    public interface IPhotoCommentRepo
    {
        Task<Tuple<bool, string>> Add(PhotoComment photoComment);
        List<PhotoComment> GetCommentsForPhoto(int photoId);
    }
}
