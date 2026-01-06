using System;
using System.Collections.Generic;
using System.Text;
using Yaans.Data.Context;
using Yaans.Data.Interfaces;
using Yaans.Domain.Models;

namespace Yaans.Data.Repos
{
    public class CategoryRepos: GenericRepository<Category>, ICategoryRepos
    {
        private readonly YaansDBContext dbContext;

        public CategoryRepos(YaansDBContext dbContext) : base(dbContext)
        {
            this.dbContext = dbContext;
        }
    }
}
