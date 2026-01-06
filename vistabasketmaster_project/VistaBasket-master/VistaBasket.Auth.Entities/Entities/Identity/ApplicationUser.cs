using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using VistaBasket.Auth.Entities.Entities.Enum;

namespace VistaBasket.Auth.Entities.Entities.Identity
{
    public class ApplicationUser : IdentityUser
    {
        [Column("firstname")]
        public string? FirstName { get; set; }

        [Column("lastname")]
        public string? LastName { get; set; }
        [Column("gender")]
        public Gender? Gender { get; set; }
    }
}
