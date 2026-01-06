using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Yaans.Data.Context;
using Yaans.Data.Interfaces;

namespace Yaans.Data.Repos
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly YaansDBContext dbContext;

        public UnitOfWork(YaansDBContext dbContext)
        {
            this.dbContext = dbContext;
        }
        public IProductRepos ProductRepos => new ProductRepos(dbContext);

        public ICategoryRepos CategoryRepos => new CategoryRepos(dbContext);

        public async Task<bool> Commit()
        {
            return await dbContext.SaveChangesAsync() > 0;
        }

        public void Dispose()
        {
            dbContext.Dispose();
        }
    }
}
