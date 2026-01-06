using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VistaBasket.Auth.Service.Model;

namespace VistaBasket.Auth.Service.Interface
{
    public interface IAuthService
    {
        Task<string> Register(RegistrationRequestDto registrationRequestDto);
        Task<LoginResponseDto> Login(LoginRequestDto login);
        Task<bool> AssignRole(string email, string roleName);
    }
}
