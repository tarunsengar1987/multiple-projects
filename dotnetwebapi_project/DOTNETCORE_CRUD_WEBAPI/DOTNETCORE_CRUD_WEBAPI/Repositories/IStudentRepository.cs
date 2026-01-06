using DOTNETCORE_CRUD_WEBAPI.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DOTNETCORE_CRUD_WEBAPI.Repositories
{
    public interface IStudentRepository
    {
        List<Student_VM> GetList();
        Student_VM Get(int id);
        int Add(Student_VM student_VM);
        int Update(int id, Student_VM student_VM);
        int Delete(int id);
    }
}
