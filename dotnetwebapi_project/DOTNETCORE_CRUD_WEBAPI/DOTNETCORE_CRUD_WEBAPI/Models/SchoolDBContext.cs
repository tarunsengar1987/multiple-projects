using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DOTNETCORE_CRUD_WEBAPI.Models
{
    public class SchoolDBContext : DbContext
    {
        public DbSet<Student> Students { get; set; }
        public SchoolDBContext(DbContextOptions<SchoolDBContext> options)
          : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
