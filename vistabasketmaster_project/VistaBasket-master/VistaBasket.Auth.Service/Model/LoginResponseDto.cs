using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace VistaBasket.Auth.Service.Model
{
    public class LoginResponseDto
    {
        public string? Token { get; set; }
        public UserDto User { get; set; }
    }
}
