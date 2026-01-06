using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AppointmentScheduling.Models;
using AppointmentScheduling.Utility;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AppointmentScheduling.Controllers
{
    [Authorize]
    public class AccountController : Controller
    {
        UserManager<ApplicationUser> _userManager;
        SignInManager<ApplicationUser> _signInManager;
        private readonly ApplicationDbContext _context;
        public AccountController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager)
        {
            this._userManager = userManager;
            this._signInManager = signInManager;
            _context = context;
        }

        //Action to render login view
        // GET: /Account/Login
        [AllowAnonymous]
        public ActionResult Login()
        {
            if (_signInManager.IsSignedIn(User))
            {
                if (User.IsInRole(Helper.admin))
                {
                    return RedirectToActionPermanent("List", "Appointment");
                }
                else
                {
                    return RedirectToActionPermanent("Index", "Appointment");
                }
            }
            return View();
        }

        //Action to validate and login
        // POST: /Account/Login
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Login(LoginViewModel model)
        {
            if (ModelState.IsValid)
            {
                var result = await _signInManager.PasswordSignInAsync(model.Email, model.Password, model.RememberMe, false);
                if (result.Succeeded)
                {
                    // code not in use
                    //var user = await _userManager.FindByNameAsync(model.Email);
                    //string role = _userManager.GetRolesAsync(user).Result.Single();
                    //if (role == Helper.admin)
                    //{
                    //    return RedirectToActionPermanent("List", "Appointment");
                    //}
                    //else
                    //{
                    //    return RedirectToActionPermanent("Index", "Appointment");
                    //}

                    var user = await _userManager.FindByNameAsync(model.Email);
                    string role = _userManager.GetRolesAsync(user).Result.Single();
                    //HttpContext.Session.SetString("Role", role);
                    return RedirectToActionPermanent("Index", "Appointment");
                }
                ModelState.AddModelError("", "Invalid login attempt.");
            }
            return View(model);
        }

        //Action to render register view
        // GET: /Account/Register
        [AllowAnonymous]
        public ActionResult Register()
        {
            return View();
        }

        //Action to register user
        // POST: /Account/Register
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Register(RegisterViewModel model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    var user = new ApplicationUser { UserName = model.Email, Email = model.Email, Name = model.Name };
                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, model.RoleName);

                        await _signInManager.SignInAsync(user, isPersistent: false);

                        if (model.RoleName == Helper.admin)
                        {
                            return RedirectToActionPermanent("List", "Appointment");
                        }
                        else
                        {
                            //if its not admin then add default start and end time.
                            var settings = new Settings();
                            settings.UserId = user.Id;
                            settings.StartTime = "10:00 AM";
                            settings.EndTime = "06:00 PM";
                            settings.IsAutoAcceptAppointment = false;
                            settings.SendEmailNotification = true;
                            _context.Settings.Add(settings);
                            _context.SaveChanges();

                            return RedirectToActionPermanent("Index", "Appointment");
                        }
                    }
                    AddErrors(result);
                }
            }
            catch (Exception ex)
            {

                throw;
            }
            return View(model);
        }

        //Action to logoff
        // POST: /Account/LogOff
        [HttpPost]
        public async Task<ActionResult> LogOff()
        {
            await _signInManager.SignOutAsync();
            return RedirectToAction("Login", "Account");
        }

        /// <summary>
        /// Function to add errors of model validation
        /// </summary>
        /// <param name="result"></param>
        private void AddErrors(IdentityResult result)
        {
            foreach (var error in result.Errors)
            {
                ModelState.AddModelError("", error.Description);
            }
        }
    }
}