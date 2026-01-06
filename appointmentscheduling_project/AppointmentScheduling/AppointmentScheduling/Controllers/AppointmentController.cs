using AppointmentScheduling.Models;
using AppointmentScheduling.Service;
using AppointmentScheduling.Utility;
using AppointmentScheduling.ViewModel;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace AppointmentScheduling.Controllers
{
    [Authorize]
    public class AppointmentController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IAppointmentService _appointmentService;
        public AppointmentController(ApplicationDbContext context, IAppointmentService appointmentService)
        {
            _context = context;
            _appointmentService = appointmentService;
        }

        /// <summary>
        /// Action to show the appointment calendar view
        /// </summary>
        /// <returns></returns>
        //[Authorize(Roles = "User")]
        public ActionResult Index()
        {
            ViewBag.Duration = Helper.GetTimeDropDown();
            ViewBag.DoctorList = _appointmentService.GetDoctorList();
            ViewBag.PatientList = _appointmentService.GetPatientList();
            return View();
        }

        /// <summary>
        /// Action to show the appointment list view
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "Admin")]
        public ActionResult List()
        {
            //var userId = User.Identity.GetUserId();
            var records = _appointmentService.GetAll();
            return View(records);
        }

        /// <summary>
        /// Action to show the settings view
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "User")]
        public ActionResult Settings()
        {
            var userId = User.Identity.GetUserId();
            var model = _context.Settings.Where(x => x.UserId == userId).Select(x => new SettingsVM() 
            {
                StartTime = x.StartTime,
                EndTime = x.EndTime,
                IsAutoAcceptAppointment = x.IsAutoAcceptAppointment,
                SendEmailNotification = x.SendEmailNotification
            }).FirstOrDefault();
            if(model == null)
            {
                model = new SettingsVM();
            }
            return View(model);
        }

        /// <summary>
        /// Action to show the settings view
        /// </summary>
        /// <returns></returns>
        [Authorize(Roles = "User")]
        [HttpPost]
        public ActionResult Settings(SettingsVM settingsVM)
        {
            var userId = User.Identity.GetUserId();
            var settings = _context.Settings.Where(x => x.UserId == userId).FirstOrDefault();
            if(settings != null)
            {
                settings.StartTime = settingsVM.StartTime;
                settings.EndTime = settingsVM.EndTime;
                settings.IsAutoAcceptAppointment = settingsVM.IsAutoAcceptAppointment;
                settings.SendEmailNotification = settingsVM.SendEmailNotification;
                _context.SaveChanges();
            }
            else
            {
                settings = new Settings();
                settings.UserId = userId;
                settings.StartTime = settingsVM.StartTime;
                settings.EndTime = settingsVM.EndTime;
                settings.IsAutoAcceptAppointment = settingsVM.IsAutoAcceptAppointment;
                settings.SendEmailNotification = settingsVM.SendEmailNotification;
                _context.Settings.Add(settings);
                _context.SaveChanges();
            }
            return RedirectToActionPermanent("Index", "Appointment");
        }
    }
}