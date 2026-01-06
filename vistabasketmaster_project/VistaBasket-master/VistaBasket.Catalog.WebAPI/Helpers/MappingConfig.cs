using AutoMapper;
using VistaBasket.Catalog.Entities.Entities;
using VistaBasket.Catalog.Service.Model.Brand;

namespace VistaBasket.Catalog.WebAPI.Helpers
{
    public class MappingConfig
    {
        public static MapperConfiguration RegisterMaps()
        {
            var mappingConfig = new MapperConfiguration(config =>
            {
                config.CreateMap<Brand, BrandDto>().ReverseMap();
            });

            return mappingConfig;
        }
    }
}
