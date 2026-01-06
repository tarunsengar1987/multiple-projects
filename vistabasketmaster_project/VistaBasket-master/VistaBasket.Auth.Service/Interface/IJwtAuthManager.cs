
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using VistaBasket.Auth.Entities.Entities.Identity;

namespace VistaBasket.Auth.Service.Interface
{
    public interface IJwtAuthManager
    {
        string GenerateToken(ApplicationUser applicationUser);

    }
}
