using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using AppointmentScheduling.Models;
using AppointmentScheduling.Service;
using AppointmentScheduling.Utility;
using AppointmentScheduling.ViewModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppointmentScheduling.Controllers.Api
{
    [Route("api/Appointment")]
    [ApiController]
    public class AppointmentController : ControllerBase
    {
        private readonly ApplicationDbContext context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IAppointmentService _appointmentService;
        private readonly string loginUserId;
        private readonly string role;

        public AppointmentController(ApplicationDbContext _context, IHttpContextAccessor httpContextAccessor, IAppointmentService appointmentService)
        {
            context = _context;
            _httpContextAccessor = httpContextAccessor;
            _appointmentService = appointmentService;
            loginUserId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
            role = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Role);
        }

        /// Code not in use
        ///// <summary>
        ///// Get all appointments
        ///// </summary>
        ///// <returns></returns>
        //[HttpGet]
        //[Route("GetCalendarData")]
        //public IActionResult GetCalendarData()
        //{
        //    CommonResponse<List<AppointmentsDto>> commonResponse = new CommonResponse<List<AppointmentsDto>>();
        //    try
        //    {
        //        commonResponse.status = Helper.success_code;
        //        commonResponse.dataenum = _appointmentService.GetAllByUserId(loginUserId);
        //    }
        //    catch (Exception ex)
        //    {
        //        commonResponse.message = ex.Message;
        //        commonResponse.status = Helper.failure_code;
        //    }
        //    return Ok(commonResponse);
        //}


        /// <summary>
        /// Get all appointments
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCalendarData")]
        public IActionResult GetCalendarData(string doctorId)
        {
            CommonResponse<List<AppointmentsDto>> commonResponse = new CommonResponse<List<AppointmentsDto>>();
            try
            {
                if(role == Helper.patient)
                {
                    commonResponse.dataenum = _appointmentService.PatientsEventsById(loginUserId);
                    commonResponse.status = Helper.success_code;
                }
                else if(role == Helper.doctor)
                {
                    commonResponse.dataenum = _appointmentService.DoctorsEventsById(loginUserId);
                    commonResponse.status = Helper.success_code;
                }
                else
                {
                    commonResponse.dataenum = _appointmentService.DoctorsEventsById(doctorId);
                    commonResponse.status = Helper.success_code;
                }
            }
            catch (Exception ex)
            {
                commonResponse.message = ex.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);
        }

        /// <summary>
        /// Get appointment by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("GetCalendarDataById/{id}")]
        public IActionResult GetCalendarDataById(int id)
        {
            CommonResponse<AppointmentsDto> commonResponse = new CommonResponse<AppointmentsDto>();
            try
            {
                commonResponse.status = Helper.success_code;
                commonResponse.dataenum = _appointmentService.GetById(id, loginUserId);
            }
            catch (Exception ex)
            {
                commonResponse.message = ex.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);
        }

        /// <summary>
        /// Add/Update appointement
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("SaveCalendarData")]
        public IActionResult SaveCalendarData(AppointmentsDto data)
        {
            CommonResponse<int> commonResponse = new CommonResponse<int>();
            try
            {
                commonResponse.status = _appointmentService.AddUpdate(data, loginUserId).Result;
                if (commonResponse.status < 0)
                {
                    commonResponse.message = Helper.appointmentExists;
                }
                if (commonResponse.status == 1)
                {
                    commonResponse.message = Helper.appointmentUpdated;
                }
                if (commonResponse.status == 2)
                {
                    commonResponse.message = Helper.appointmentAdded;
                }

                if (commonResponse.status > 0)
                {
                    commonResponse.status = 1;
                }
            }
            catch (Exception ex)
            {
                commonResponse.message = ex.Message;
                commonResponse.status = Helper.failure_code;
            }

            return Ok(commonResponse);
        }

        /// <summary>
        /// Delete appointement
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("DeleteAppoinment/{id}")]
        public IActionResult DeleteAppoinment(int id)
        {
            CommonResponse<int> commonResponse = new CommonResponse<int>();
            try
            {
                commonResponse.status = _appointmentService.Delete(id);
                commonResponse.message = commonResponse.status == 1 ? Helper.appointmentDeleted : Helper.somethingWentWrong;
            }
            catch (Exception ex)
            {
                commonResponse.message = ex.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);
        }

        /// <summary>
        /// Get user list
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("GetUser")]
        public IActionResult GetUser()
        {
            CommonResponse<List<UserVM>> commonResponse = new CommonResponse<List<UserVM>>();
            try
            {
                commonResponse.dataenum = _appointmentService.GetUser(loginUserId);
                commonResponse.status = Helper.success_code;
            }
            catch (Exception ex)
            {
                commonResponse.message = ex.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);
        }

        /// <summary>
        /// Function to check if appointment overlaps
        /// </summary>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="id"></param>
        /// <returns>bool</returns>
        private bool CheckAppoinmentOverlap(DateTime start, DateTime end, int id)
        {
            List<AppointmentsDto> data = new List<AppointmentsDto>();
            var records = context.Appointments.Where(x => x.UserId == this.loginUserId).ToList().Select(c => new AppointmentsDto()
            {
                Sr = c.Id,
                Start_Date = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                End_Date = c.StartDate.AddMinutes(c.Duration).ToString("yyyy-MM-dd HH:mm:ss"),
            }).ToList();

            if (records.Any())
            {
                foreach (var item in records)
                {
                    var startAppoiment = DateTime.Parse(item.Start_Date);
                    var endAppoiment = DateTime.Parse(item.End_Date);

                    if (((start >= startAppoiment && start <= endAppoiment) || (end >= startAppoiment && end <= endAppoiment)) && item.Sr != id)
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        //API not in use
        //[HttpPost]
        //[Route("GetTimeSlots")]
        //public IActionResult GetTimeSlots(TimeSlotInputVM input)
        //{
        //    CommonResponse<List<TimeSlotOutputVM>> commonResponse = new CommonResponse<List<TimeSlotOutputVM>>();
        //    try
        //    {
        //        if(input.EventDate != null && input.ClientId != loginUserId)
        //        {
        //            var date = DateTime.Parse(input.EventDate).Date;
        //            var result = _appointmentService.GetTimeSlots(input);
        //            commonResponse.status = Helper.success_code;
        //            commonResponse.dataenum = result;
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        commonResponse.message = ex.Message;
        //        commonResponse.status = Helper.failure_code;
        //    }

        //    return Ok(commonResponse);
        //}

        [HttpGet]
        [Route("ConfirmEvent/{id}")]
        public IActionResult ConfirmEvent(int id)
        {
            CommonResponse<int> commonResponse = new CommonResponse<int>();
            try
            {
                var result = _appointmentService.ConfirmEvent(id).Result;
                if(result > 0)
                {
                    commonResponse.status = Helper.success_code;
                    commonResponse.message = Helper.meetingConfirm;
                }
                else
                {
                    commonResponse.status = Helper.failure_code;
                    commonResponse.message = Helper.meetingConfirmError;
                }
            }
            catch (Exception ex)
            {
                commonResponse.message = ex.Message;
                commonResponse.status = Helper.failure_code;
            }
            return Ok(commonResponse);
        }
    }
}