using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Yaans.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static string GetUserId(this ClaimsPrincipal principal)
        {
            if(principal == null)
            {
                throw new ArgumentNullException(nameof(principal));
            }
            var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
            return userId;
        }
    }
}
