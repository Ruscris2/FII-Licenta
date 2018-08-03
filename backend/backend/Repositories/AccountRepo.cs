using System;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Text;
using System.Security.Cryptography;

namespace backend.Repositories
{
    public class AccountRepo : IAccountRepo
    {
        private readonly DatabaseContext dbContext;
        private readonly DbSet<Account> accounts;

        public AccountRepo(DatabaseContext context)
        {
            dbContext = context;
            accounts = dbContext.Set<Account>();
        }

        // Logic for registering a new account
        public async Task<Tuple<bool, string>> Add(Account account)
        {
            // Check if email and username are unique
            var check = (from acc in dbContext.Accounts
                        where acc.Email == account.Email || acc.Username == account.Username
                        select acc).Count();

            // If no account has the email and/or username already, create a new account
            if (check == 0)
            {
                // Hash the password using SHA256
                byte[] bytes = Encoding.UTF8.GetBytes(account.Password);
                SHA256Managed cipher = new SHA256Managed();
                byte[] hash = cipher.ComputeHash(bytes);

                // Digest the hash
                account.Password = "";
                foreach (byte b in hash)
                    account.Password += string.Format("{0:x2}", b);

                try
                {
                    await accounts.AddAsync(account);
                    await dbContext.SaveChangesAsync();
                }
                catch
                {
                    return Tuple.Create(false, "Unexpected error while creating account!");
                }

                return Tuple.Create(true, "");
            }

            return Tuple.Create(false, "Username or email already exists!");
        }

        // Get an account based on it's identifier (username or email)
        public Account GetByIdentifier(string identifier)
        {
            Account account = (from acc in dbContext.Accounts
                               where acc.Username == identifier || acc.Email == identifier
                               select acc).FirstOrDefault();

            return account;
        }

        public async Task Update(Account account)
        {
            accounts.Update(account);
            await dbContext.SaveChangesAsync();
        }
    }
}
