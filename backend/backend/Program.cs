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
            var server = new WebHostBuilder()
                .UseKestrel()
                .UseStartup<Program>()
                .Build();

            server.Run();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
            services.AddDbContext<DatabaseContext>();

            services.AddTransient<IAccountRepo, AccountRepo>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logger)
        {
            logger.AddConsole(LogLevel.Information);
            app.UseMvc();
        }
    }
}
