using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Yaans.Data.Interfaces
{
    public interface IRepository<T> where T:class
    {
        IEnumerable<T> Get();
        Task<IEnumerable<T>> GetAsync();
        T Get(int id);
        Task<T> GetAsync(int id);
        void Add(T entity);
        void Update(T entity);
        T Delete(int id);
    }
}
