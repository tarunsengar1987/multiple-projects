using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Yaans.Data.Context;
using Yaans.Data.Interfaces;
using Yaans.Domain.Models;

namespace Yaans.Data.Repos
{
    public class GenericRepository<T> : IRepository<T> where T : BaseEntity
    {
        private readonly YaansDBContext dbContext;
        private readonly DbSet<T> dbSet;
        public GenericRepository(YaansDBContext dbContext)
        {
            this.dbContext = dbContext;
            this.dbSet = this.dbContext.Set<T>();
        }
        public IEnumerable<T> Get()
        {
            return this.dbSet.ToList();
        }

        public T Get(int id)
        {
            return this.dbSet.Find(id);
        }

        public async Task<IEnumerable<T>> GetAsync()
        {
            return await this.dbSet.ToListAsync();
        }

        public async Task<T> GetAsync(int id)
        {
            return await this.dbSet.FindAsync(id);
        }
        public void Add(T entity)
        {
            entity.CreatedOn = DateTime.Now;
            this.dbSet.Add(entity);
        }
        public void Update(T entity)
        {
            entity.UpdatedOn = DateTime.Now;
            dbContext.Entry(entity).State = EntityState.Modified;
            this.dbSet.Attach(entity);
            this.dbContext.Entry(entity).State = EntityState.Modified;
        }
        public T Delete(int id)
        {
            var entity = this.dbSet.Find(id);
            this.dbSet.Remove(entity);
            return entity;
        }
    }
}
