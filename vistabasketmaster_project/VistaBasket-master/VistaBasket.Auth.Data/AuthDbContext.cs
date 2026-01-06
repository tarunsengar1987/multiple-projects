using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using VistaBasket.Auth.Entities.Entities;
using VistaBasket.Auth.Entities.Entities.Identity;

namespace VistaBasket.Auth.Data
{
    public class AuthDbContext : IdentityDbContext<ApplicationUser, IdentityRole, string, IdentityUserClaim<string>, IdentityUserRole<string>, IdentityUserLogin<string>, IdentityRoleClaim<string>, IdentityUserToken<string>>
    {
        public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options)
        {

        }
        public virtual DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public virtual DbSet<Menu> MainMenus { get; set; } = null!;

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
                    }
                }
            }
            var result = await base.SaveChangesAsync();
            return result;
        }
    }
}
