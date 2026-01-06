using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yaans.Data.Interfaces;
using Yaans.Domain.Models;
using Yaans.Domain.ViewModels;

namespace Yaans.Controllers
{
    public class ProductController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;

        public ProductController(IUnitOfWork uow, IMapper mapper)
        {
            this.uow = uow;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var products = await uow.ProductRepos.GetAsync();
            var productModel = mapper.Map<IEnumerable<ProductViewModel>>(products);
            return Ok(productModel);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var product = await uow.ProductRepos.GetAsync(id);
            var productModel = mapper.Map<CategoryViewModel>(product);
            return Ok(productModel);
        }

        [HttpPost]
        public async Task<IActionResult> Add(ProductViewModel model)
        {
            Product product = mapper.Map<Product>(model);
            uow.ProductRepos.Add(product);
            await uow.Commit();
            return Ok(model);
        }

        [HttpPut]
        public async Task<IActionResult> Update(ProductViewModel model)
        {
            Product product = mapper.Map<Product>(model);
            uow.ProductRepos.Update(product);
            await uow.Commit();
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            uow.ProductRepos.Delete(id);
            await uow.Commit();
            return Ok();
        }

    }
}
