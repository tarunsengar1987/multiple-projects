using VistaBasket.Auth.Service.Model;

namespace VistaBasket.Auth.WebAPI.Extensions
{
    public static class AppConfigSettings
    {
        public static IServiceCollection AppConfigSettingsServices(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<JwtOptions>(config.GetSection(nameof(JwtOptions)));
            return services;
        }
    }
}
