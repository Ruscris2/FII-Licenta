using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using backend.Repositories;
using Microsoft.IdentityModel.Tokens;
using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;

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
            // Setup CORS
            services.AddCors(c => c.AddPolicy("CorsPolicy", builder =>
            {
                builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
            }));

            // Add database and mvc to services
            services.AddMvc();
            services.AddDbContext<DatabaseContext>();

            // Add authentication
            services.AddAuthentication(a =>
            {
                a.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                a.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(cfg =>
            {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;

                cfg.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidIssuer = "FIILicense",
                    ValidAudience = "FIILicense",
                    IssuerSigningKey = new SymmetricSecurityKey(Convert.FromBase64String("bGljZW50YS1maWktMjAxOA=="))
                };
            });


            // Configure Swagger
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Swashbuckle.AspNetCore.Swagger.Info { Title = "Backend API", Description = "API" });
            });

            // Register repositories
            services.AddTransient<IAccountRepo, AccountRepo>();
        }

        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory logger)
        {
            logger.AddConsole(LogLevel.Information);

            app.UseCors("CorsPolicy");
            app.UseAuthentication();
            app.UseMvc();

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Backend API");
            });
        }
    }
}
