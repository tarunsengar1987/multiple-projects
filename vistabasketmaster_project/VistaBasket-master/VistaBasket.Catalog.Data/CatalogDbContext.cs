using Microsoft.EntityFrameworkCore;
using VistaBasket.Catalog.Entities.Entities;

namespace VistaBasket.Catalog.Data
{
    public class CatalogDbContext : DbContext
    {
        public CatalogDbContext(DbContextOptions<CatalogDbContext> options) : base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
        public DbSet<Brand> Brands { get; set; }

        public virtual async Task<int> SaveChangesAsync(string userId = null!)
        {
            DateTime now = DateTime.Now;
            foreach (Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry changedEntity in ChangeTracker.Entries())
            {

                if (changedEntity.Entity is BaseEntity entity)
                {
                    switch (changedEntity.State)
                    {
                        case EntityState.Added:
                            entity.CreatedOn = DateTime.Now.ToUniversalTime();
                            entity.UpdatedOn = DateTime.Now.ToUniversalTime();
                            entity.IsActive = true;
                            break;
                        case EntityState.Modified:
                            Entry(entity).Property(x => x.UpdatedOn).IsModified = false;
                            entity.UpdatedOn = DateTime.Now.ToUniversalTime();
                            break;
                        case EntityState.Deleted:
                            entity.UpdatedOn = DateTime.Now.ToUniversalTime();
                            entity.IsActive = false;
                            break;
                    }
                }

            }
            //OnBeforeSaveChanges(userId);
            var result = await base.SaveChangesAsync();
            return result;
        }
    }
}
