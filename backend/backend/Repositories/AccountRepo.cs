
using System.Collections.Generic;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    public class AccountRepo : IAccountRepo
    {
        private readonly DatabaseContext dbContext;
        private readonly DbSet<Account> entities;

        public AccountRepo(DatabaseContext context)
        {
            dbContext = context;
            entities = dbContext.Set<Account>();
        }

        public async Task Add(Account account)
        {
            await entities.AddAsync(account);
            await dbContext.SaveChangesAsync();
        }

        public async Task<IEnumerable<Account>> GetAll()
        {
            return await entities.ToListAsync();
        }
    }
}
