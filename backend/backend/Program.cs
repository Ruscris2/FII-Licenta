using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using backend.Repositories;

namespace backend
{
    class Program
    {
        static void Main(string[] args)
        {
            // Create the web host
            var server = new WebHostBuilder()
                .UseKestrel()
                .UseStartup<Program>()
                .Build();

            server.Run();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Add database and mvc to services
            services.AddMvc();
            services.AddDbContext<DatabaseContext>();

            // Register repositories
            services.AddTransient<IAccountRepo, AccountRepo>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logger)
        {
            logger.AddConsole(LogLevel.Information);
            app.UseMvc();
        }
    }
}
