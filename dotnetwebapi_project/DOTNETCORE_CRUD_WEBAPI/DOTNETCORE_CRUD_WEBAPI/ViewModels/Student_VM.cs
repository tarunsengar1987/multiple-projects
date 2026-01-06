using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DOTNETCORE_CRUD_WEBAPI.ViewModels
{
    public class Student_VM
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DateOfBirth { get; set; }
        public string Gender { get; set; }
        public string BloodGroup { get; set; }
    }
}