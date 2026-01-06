using AutoMapper;
using AutoMapper.Configuration;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Yaans.Domain.Identity;
using Yaans.Domain.ViewModels;
using Yaans.Extensions;

namespace Yaans.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly IMapper mapper;
        private readonly IWebHostEnvironment environment;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IMapper mapper, IWebHostEnvironment _environment)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            //this.configuration = configuration;
            this.mapper = mapper;
            this.environment = _environment;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var user = await userManager.GetUserAsync(User);
            var userModel = mapper.Map<AppUserModel>(user);
            string profielImage = Path.Combine("https:",HttpContext.Request.Host.Value, userModel.ProfileImage);
            userModel.ProfileImage = profielImage.Replace("\\", "//"); ;
            return Ok(userModel);
        }

        [HttpPost]
        [Route("uploadprofile")]
        public async Task<IActionResult> UploadProfile()
        {
            var formCollection = await Request.ReadFormAsync();
            var file = formCollection.Files.First();
            //var folderName = Path.Combine("Resources", "Images");

            if (file == null || file.Length == 0)
            {
                return BadRequest("file not selected");
            }
            else
            {
                string folderName = Path.Combine(this.environment.WebRootPath, "Images");
                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                //var pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
                var fullPath = Path.Combine(folderName, fileName);

                using (var stream = new FileStream(fullPath, FileMode.Create))
                {
                    file.CopyTo(stream);
                }
                
                var IsFileExists = System.IO.File.Exists(fullPath);
                if (IsFileExists == true)
                {
                    var user = await userManager.GetUserAsync(User);
                    user.ProfileImage = Path.Combine("Images", fileName);
                    var result = await userManager.UpdateAsync(user);
                    if (!result.Succeeded)
                    {
                        return BadRequest("File couldn't save.");
                    }
                }
                var virtualpath = Path.Combine(HttpContext.Request.Host.Value, "Images");
                var filePath = Path.Combine("https:", virtualpath, fileName);
                filePath = filePath.Replace("\\", "//");
                return Ok(new { filePath });
            }
        }
    }
}
