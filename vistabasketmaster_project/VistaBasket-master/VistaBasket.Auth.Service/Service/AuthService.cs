using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using VistaBasket.Auth.Data;
using VistaBasket.Auth.Entities.Entities.Identity;
using VistaBasket.Auth.Service.Interface;
using VistaBasket.Auth.Service.Model;

namespace VistaBasket.Auth.Service.Service
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly AuthDbContext _context;
        private readonly IJwtAuthManager _jwtAuthManager;
        public AuthService(UserManager<ApplicationUser> userManager, AuthDbContext context, IJwtAuthManager jwtAuthManager)
        {
            _userManager = userManager;
            _context = context;
            _jwtAuthManager = jwtAuthManager;
        }

        public Task<bool> AssignRole(string email, string roleName)
        {
            throw new NotImplementedException();
        }

        public async Task<LoginResponseDto> Login(LoginRequestDto loginRequest)
        {
            var user = _context.ApplicationUsers.FirstOrDefault(u => u.UserName.ToLower() == loginRequest.Email.ToLower());
            if (user == null)
            {
                return new LoginResponseDto();
            }
            bool isValid = await _userManager.CheckPasswordAsync(user, loginRequest.Password);
            if (!isValid)
            {
                return new LoginResponseDto();
            }
            var token = _jwtAuthManager.GenerateToken(user);
            UserDto userDTO = new()
            {
                Email = user.Email,
                ID = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber
            };

            LoginResponseDto loginResponseDto = new LoginResponseDto()
            {
                User = userDTO,
                Token = token
            };

            return loginResponseDto;
        }

        public async Task<string> Register(RegistrationRequestDto registrationRequestDto)
        {
            ApplicationUser user = new()
            {
                UserName = registrationRequestDto.Email,
                Email = registrationRequestDto.Email,
                NormalizedEmail = registrationRequestDto.Email.ToUpper(),
                FirstName = registrationRequestDto.FirstName,
                LastName = registrationRequestDto.LastName,
                PhoneNumber = registrationRequestDto.PhoneNumber
            };
            var result = await _userManager.CreateAsync(user, registrationRequestDto.Password);
            if (result.Succeeded)
            {
                var userToReturn = _context.ApplicationUsers.First(u => u.UserName == registrationRequestDto.Email);
                UserDto userDto = new()
                {
                    Email = userToReturn.Email,
                    ID = userToReturn.Id,
                    FirstName = userToReturn.FirstName,
                    LastName = userToReturn.LastName,
                    PhoneNumber = userToReturn.PhoneNumber
                };
                return "";
            }
            else
            {
                return result.Errors.FirstOrDefault().Description;
            }
        }
    }
}
