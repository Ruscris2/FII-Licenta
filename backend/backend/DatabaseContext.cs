
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Photo> Photos { get; set; }

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
            // Connect to the database
            optionsBuilder.UseSqlServer("Server = (LocalDB)\\MSSQLLocalDB; Database = FIILicense; Trusted_Connection = true;");
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            // Add constraints to the database tables
            builder.Entity<Account>().HasIndex(x => x.Username).IsUnique();
            builder.Entity<Account>().HasIndex(x => x.Email).IsUnique();
        }
    }
}
