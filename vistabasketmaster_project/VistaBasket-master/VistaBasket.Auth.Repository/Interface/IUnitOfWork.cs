using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VistaBasket.Auth.Entities.Entities;
using VistaBasket.Auth.Repository.Interface;

namespace VistaBasket.Auth.Repository.Interface
{
    public interface IUnitOfWork : IDisposable
    {
        IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity;
        Task<int> Complete();
        Task<int> Complete(string userId);
    }
}
