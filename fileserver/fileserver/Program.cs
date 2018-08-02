using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace fileserver
{
    class Program
    {
        static void Main(string[] args)
        {
            // Create the web host
            var server = new WebHostBuilder()
                .UseKestrel()
                .UseStartup<Program>()
                .UseUrls("http://localhost:5001")
                .Build();

            server.Run();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            // Setup CORS
            services.AddCors(c => c.AddPolicy("CorsPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            services.AddMvc();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logger)
        {
            logger.AddConsole(LogLevel.Information);

            app.UseCors("CorsPolicy");
            app.UseMvc();
        }
    }
}
