using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VistaBasket.Catalog.Service.Model.Brand;

namespace VistaBasket.Catalog.Service.Interface
{
    public interface IBrandService
    {
        Task<BrandDto> Create(BrandDto brand);
        Task<List<BrandDto>> GetAll();
        BrandDto GetBrand(string id);
    }
}
