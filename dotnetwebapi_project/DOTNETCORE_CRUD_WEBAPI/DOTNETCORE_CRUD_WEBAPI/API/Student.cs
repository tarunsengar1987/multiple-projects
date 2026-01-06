using DOTNETCORE_CRUD_WEBAPI.Repositories;
using DOTNETCORE_CRUD_WEBAPI.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace DOTNETCORE_CRUD_WEBAPI.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class Student : ControllerBase
    {
        private readonly IStudentRepository _studentRepository;
        public Student(IStudentRepository studentRepository)
        {
            _studentRepository = studentRepository;
        }

        [HttpGet]
        [Route("{id}")]
        public IActionResult Get(int id)
        {
            CommonResponse<Student_VM> response = new CommonResponse<Student_VM>();
            var result = _studentRepository.Get(id);
            if (result != null)
            {
                response.status = 1;
                response.dataenum = result;
            }
            else
            {
                response.message = "Student data not found";
            }
            return Ok(response);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Student_VM student)
        {
            CommonResponse<Student_VM> response = new CommonResponse<Student_VM>();
            var result = _studentRepository.Add(student);
            if (result == 1)
            {
                response.status = 1;
                response.message = "Student added successfully";
            }
            else
            {
                response.message = "Student added un-successfully";
            }
            return Ok(response);
        }

        [HttpPut]
        public IActionResult Put(int id, [FromBody] Student_VM student)
        {
            CommonResponse<Student_VM> response = new CommonResponse<Student_VM>();
            var result = _studentRepository.Update(id, student);
            if (result == 1)
            {
                response.status = 1;
                response.message = "Student updated successfully";
            }
            else
            {
                response.message = "Student updated un-successfully";
            }
            return Ok(response);
        }

        [HttpDelete]
        [Route("{id}")]
        public IActionResult Delete(int id)
        {
            CommonResponse<Student_VM> response = new CommonResponse<Student_VM>();
            var result = _studentRepository.Delete(id);
            if (result == 1)
            {
                response.status = 1;
                response.message = "Student deleted successfully";
            }
            else
            {
                response.message = "Student deleted un-successfully";
            }
            return Ok(response);
        }
    }
}
