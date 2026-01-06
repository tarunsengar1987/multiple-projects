using System.Collections;
using VistaBasket.Auth.Data;
using VistaBasket.Auth.Entities.Entities;
using VistaBasket.Auth.Repository.Interface;

namespace VistaBasket.Auth.Repository.Service
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AuthDbContext _context;
        private Hashtable _repositories;
        public UnitOfWork(AuthDbContext DataBaseContext)
        {
            _context = DataBaseContext;
        }

        public async Task<int> Complete()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task<int> Complete(string userId)
        {
            return await _context.SaveChangesAsync(userId);
        }

        public void Dispose()
        {
            _context.Dispose();
        }
        public void SaveChanges()
        {
            _context.SaveChanges();
        }
        public IGenericRepository<TEntity> Repository<TEntity>() where TEntity : BaseEntity
        {
            if (_repositories == null) _repositories = new Hashtable();

            var type = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);

                var reposiotryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);

                _repositories.Add(type, reposiotryInstance);
            }
            return (IGenericRepository<TEntity>)_repositories[type];
        }
    }
}
