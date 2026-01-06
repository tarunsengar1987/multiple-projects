using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Yaans.Domain.Identity;
using Yaans.Domain.ViewModels;

namespace Yaans.Controllers
{
    public class AuthController : BaseController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IConfiguration configuration;
        public AuthController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
        }

        [Route("login")]
        [HttpPost]
        public async Task<IActionResult> LogIn(LogInViewModel model, string returnUrl)
        {
            var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: model.RememberMe, false);
            if (result.Succeeded)
            {
                var user = await userManager.FindByEmailAsync(model.Email);
                var authClaims = new List<Claim>()
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim(ClaimTypes.MobilePhone, user.PhoneNumber),
                        new Claim(ClaimTypes.NameIdentifier,user.Id),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
                    };
                var authSignInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));
                var token = new JwtSecurityToken(
                        issuer: configuration["JWT:ValidIssuer"],
                        audience: configuration["JWT:ValidAudience"],
                        claims: authClaims,
                        expires: DateTime.Now.AddDays(1.1),
                        signingCredentials: new SigningCredentials(authSignInKey, SecurityAlgorithms.HmacSha256)
                    );
                //if (!string.IsNullOrEmpty(returnUrl))
                //{
                //    return LocalRedirect(returnUrl);
                //} 
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    UserName = user.UserName,
                    PhoneNumber = user.PhoneNumber
                });
            }
            throw new UnauthorizedAccessException("Invalid login attempt!");
        }

        [Route("register")]
        [HttpPost]
        public async Task<IActionResult> Register(RegisterViewModel model)
        {
            var user = new AppUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                PhoneNumber = model.PhoneNumber
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                var curruser = await signInManager.PasswordSignInAsync(model.Email, model.Password, isPersistent: false, false);
                //await signInManager.SignInAsync(user, isPersistent: false);
                return Ok(curruser);
            }
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError(error.Code, error.Description);
            }
            throw new Exception("Entered Username already taken.");
        }
    }
}
