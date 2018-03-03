
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }

        public DatabaseContext()
        {
            Database.EnsureCreated();
        }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Server = (LocalDB)\\MSSQLLocalDB; Database = FIILicense; Trusted_Connection = true;");
        }
    }
}
