using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Yaans.Data.Interfaces;
using Yaans.Domain.Identity;
using Yaans.Domain.Models;
using Yaans.Domain.ViewModels;
using Yaans.Extensions;

namespace Yaans.Controllers
{
    public class CategoryController : BaseController
    {
        private readonly IUnitOfWork uow;
        private readonly IMapper mapper;
        private readonly UserManager<AppUser> _userManager;

        public CategoryController(IUnitOfWork uow, IMapper mapper, UserManager<AppUser> userManager)
        {
            this.uow = uow;
            this.mapper = mapper;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var categories = await uow.CategoryRepos.GetAsync();
            var categoryModel = mapper.Map<IEnumerable<CategoryViewModel>>(categories);
            return Ok(categoryModel);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var category = await uow.CategoryRepos.GetAsync(id);
            var categoryModel = mapper.Map<CategoryViewModel>(category);
            return Ok(categoryModel);
        }

        [HttpPost]
        public async Task<IActionResult> Add(CategoryViewModel model)
        {
            Category category = mapper.Map<Category>(model);
            category.CreatedBy = User.GetUserId();
            uow.CategoryRepos.Add(category);
            await uow.Commit();
            return Ok(model);
        }

        [HttpPut]
        public async Task<IActionResult> Update(CategoryViewModel model)
        {
            Category category = await uow.CategoryRepos.GetAsync(model.Id);
            category = mapper.Map<Category>(model);
            category.UpdatedBy = User.GetUserId();
            uow.CategoryRepos.Update(category);
            await uow.Commit();
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = uow.CategoryRepos.Delete(id);
            await uow.Commit();
            return Ok(category);
        }
    }
}
