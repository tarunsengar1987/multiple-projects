using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DOTNETCORE_CRUD_WEBAPI.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace DOTNETCORE_CRUD_WEBAPI.Controllers
{
    public class StudentController : Controller
    {
        private readonly IStudentRepository _studentRepository;

        public StudentController(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        public IActionResult List()
        {
            return View(_studentRepository.GetList());
        }
    }
}
