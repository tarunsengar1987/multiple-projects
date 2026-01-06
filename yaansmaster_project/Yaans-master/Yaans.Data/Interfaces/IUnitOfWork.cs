using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Yaans.Data.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        ICategoryRepos CategoryRepos { get; }
        IProductRepos ProductRepos { get; }
        Task<bool> Commit();
    }
}
