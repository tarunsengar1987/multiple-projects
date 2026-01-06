using System;
using System.Collections.Generic;
using System.Text;
using Yaans.Domain.Models;

namespace Yaans.Data.Interfaces
{
    public interface IProductRepos : IRepository<Product>
    {
        IEnumerable<Product> GettopProducts(int count);
    }
}
