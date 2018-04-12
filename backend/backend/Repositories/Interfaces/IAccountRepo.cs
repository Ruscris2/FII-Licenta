
using backend.Models;
using System;
using System.Threading.Tasks;

namespace backend.Repositories
{
    public interface IAccountRepo
    {
        Task<Tuple<bool, string>> Add(Account account);
        Tuple<Account, string> GetByIdentifier(string identifier);
        Task Update(Account account);
    }
}
