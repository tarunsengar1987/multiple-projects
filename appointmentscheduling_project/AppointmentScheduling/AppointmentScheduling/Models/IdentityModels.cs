using AppointmentScheduling.Utility;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;

namespace AppointmentScheduling.Models
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<Settings> Settings { get; set; }

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
           : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<IdentityRole>().HasData(
                new IdentityRole
                {
                    Name = Helper.admin,
                    NormalizedName = Helper.admin.ToUpper()
                },
                new IdentityRole
                {
                    Name = Helper.doctor,
                    NormalizedName = Helper.doctor.ToUpper()
                },
                new IdentityRole
                {
                    Name = Helper.patient,
                    NormalizedName = Helper.patient.ToUpper()
                });
        }
    }
}