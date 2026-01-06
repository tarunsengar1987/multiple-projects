using AutoMapper;
using Azure.Core;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VistaBasket.Catalog.Entities.Entities;
using VistaBasket.Catalog.Repository.Interface;
using VistaBasket.Catalog.Service.Interface;
using VistaBasket.Catalog.Service.Model.Brand;

namespace VistaBasket.Catalog.Service.Service
{
    public class BrandService : IBrandService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public BrandService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }
        public async Task<BrandDto> Create(BrandDto brandDto)
        {
            var brand = _mapper.Map<BrandDto, Brand>(brandDto);
            brand.CreatedBy = "Admin";
            await _unitOfWork.Repository<Brand>().AddAsync(brand, "");
            await _unitOfWork.Complete();
            return brandDto;
        }

        public async Task<List<BrandDto>> GetAll()
        {
            var result = await _unitOfWork.Repository<Brand>().ListAllAsync();
            var asset = _mapper.Map<IReadOnlyList<Brand>, List<BrandDto>>(result);
            return asset;
        }

        public BrandDto GetBrand(string id)
        {
            throw new NotImplementedException();
        }
    }
}
