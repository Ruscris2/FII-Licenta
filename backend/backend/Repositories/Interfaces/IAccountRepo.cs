
using backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IAccountRepo
    {
        Task Add(Account account);
        Task<IEnumerable<Account>> GetAll();
    }
}
