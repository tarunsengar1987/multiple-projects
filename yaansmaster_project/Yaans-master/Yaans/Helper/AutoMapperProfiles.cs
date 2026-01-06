using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Yaans.Domain.Identity;
using Yaans.Domain.Models;
using Yaans.Domain.ViewModels;
using Yaans.Extensions;

namespace Yaans.Helper
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<Category, CategoryViewModel>().ReverseMap();
            CreateMap<Product, ProductViewModel>().ReverseMap();
            CreateMap<AppUser, AppUserModel>().ReverseMap().IgnoreNoMap();
        }
    }
}
