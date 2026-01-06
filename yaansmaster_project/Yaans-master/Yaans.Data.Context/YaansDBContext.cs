using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using Yaans.Domain.Identity;
using Yaans.Domain.Models;

namespace Yaans.Data.Context
{
    public class YaansDBContext : IdentityDbContext<AppUser>
    {
        public YaansDBContext(DbContextOptions<YaansDBContext> opt) : base(opt)
        {

        }
        protected YaansDBContext()
        {
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Category { get; set; }
    }
}
