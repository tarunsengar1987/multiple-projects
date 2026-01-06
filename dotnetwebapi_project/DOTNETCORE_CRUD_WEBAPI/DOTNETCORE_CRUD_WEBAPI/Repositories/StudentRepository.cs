using DOTNETCORE_CRUD_WEBAPI.Models;
using DOTNETCORE_CRUD_WEBAPI.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DOTNETCORE_CRUD_WEBAPI.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        /// <summary>
        /// read only properties
        /// </summary>
        private readonly SchoolDBContext _context;

        /// <summary>
        /// Constructor to inject various services and context
        /// </summary>
        /// <param name="context"></param>
        public StudentRepository(SchoolDBContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Function for add student
        /// </summary>
        /// <param name="student_VM"></param>
        /// <returns></returns>
        public int Add(Student_VM student_VM)
        {
            var student = new Student();
            student.FirstName = student_VM.FirstName;
            student.LastName = student_VM.LastName;
            student.DateOfBirth = student_VM.DateOfBirth != "" ? DateTime.Parse(student_VM.DateOfBirth) : DateTime.Now;
            student.Gender = student_VM.Gender;
            student.BloodGroup = student_VM.BloodGroup;
            _context.Students.Add(student);
            return _context.SaveChanges();
        }

        /// <summary>
        /// Funcion for delete the student
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public int Delete(int id)
        {
            var student = _context.Students.Where(x => x.Id == id).FirstOrDefault();
            if (student != null)
            {
                _context.Students.Remove(student);
                return _context.SaveChanges();
            }
            return 0;
        }

        /// <summary>
        /// Function for get the student by id
        /// </summary>
        /// <param name="Id"></param>
        /// <returns></returns>
        public Student_VM Get(int id)
        {
            var student = (from stud in _context.Students
                           where stud.Id == id
                           select new Student_VM
                           {
                               Id = stud.Id,
                               FirstName = stud.FirstName,
                               LastName = stud.LastName,
                               BloodGroup = stud.BloodGroup,
                               Gender = stud.Gender,
                               DateOfBirth = stud.DateOfBirth.Value.ToString("yyyy-MM-dd")
                           }).FirstOrDefault();

            return student;
        }

        /// <summary>
        /// Function for get list of students
        /// </summary>
        /// <returns></returns>
        public List<Student_VM> GetList()
        {
            var students = (from stud in _context.Students
                           select new Student_VM
                           {
                               Id = stud.Id,
                               FirstName = stud.FirstName,
                               LastName = stud.LastName,
                               BloodGroup = stud.BloodGroup,
                               Gender = stud.Gender,
                               DateOfBirth = stud.DateOfBirth.Value.ToString("yyyy-MM-dd")
                           }).OrderByDescending(x=>x.Id).ToList();
            return students;
        }

        /// <summary>
        /// Function for update student
        /// </summary>
        /// <param name="student_VM"></param>
        /// <returns></returns>
        public int Update(int id,Student_VM student_VM)
        {
            var student = _context.Students.Where(x => x.Id == id).FirstOrDefault();
            if (student != null)
            {
                student.FirstName = student_VM.FirstName;
                student.LastName = student_VM.LastName;
                student.DateOfBirth = DateTime.Parse(student_VM.DateOfBirth);
                student.Gender = student_VM.Gender;
                student.BloodGroup = student_VM.BloodGroup;
                return _context.SaveChanges();
            }
            return 0;
        }
    }
}
