using VistaBasket.Catalog.Repository.Interface;
using VistaBasket.Catalog.Repository.Service;
using VistaBasket.Catalog.Service.Interface;
using VistaBasket.Catalog.Service.Service;
using VistaBasket.Catalog.WebAPI.Middleware;

namespace VistaBasket.Catalog.WebAPI.Extensions
{
    public static class ConfigApplicationServices
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IBrandService, BrandService>();
            services.AddTransient<ExceptionHandlingMiddleware>();
            return services;
        }
    }
}
