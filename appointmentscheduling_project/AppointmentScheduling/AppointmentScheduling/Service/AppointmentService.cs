using AppointmentScheduling.Models;
using AppointmentScheduling.Utility;
using AppointmentScheduling.ViewModel;
using MailKit.Security;
using Microsoft.AspNetCore.Html;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace AppointmentScheduling.Service
{
    public class AppointmentService : IAppointmentService
    {
        /// <summary>
        /// read only properties
        /// </summary>
        private readonly ApplicationDbContext _context;
        public readonly IConfiguration _configuration;

        /// <summary>
        /// Constructor to inject various services and context
        /// </summary>
        /// <param name="context"></param>
        public AppointmentService(IConfiguration configuration, ApplicationDbContext context)
        {
            _context = context;
            _configuration = configuration;
        }

        /// <summary>
        /// function to get the calendar data for particular user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<AppointmentsDto> GetAllByUserId(string userId)
        {
            // Not in use
            var records = _context.Appointments.Where(x => x.UserId == userId || x.ClientId == userId).ToList().Select(c => new AppointmentsDto()
            {
                Sr = c.Id,
                Desc = c.Description,
                Start_Date = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                End_Date = c.StartDate.AddMinutes(c.Duration).ToString("yyyy-MM-dd HH:mm:ss"),
                Title = c.Title,
                Duration = Convert.ToString(c.Duration),
                IsClientApprove = c.IsClientApprove
            }).ToList();
            return records;
        }

        public List<AppointmentsDto> DoctorsEventsById(string doctorId)
        {
            var records = _context.Appointments.Where(x => x.DoctorId == doctorId).ToList().Select(c => new AppointmentsDto()
            {
                Sr = c.Id,
                Desc = c.Description,
                Start_Date = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                End_Date = c.StartDate.AddMinutes(c.Duration).ToString("yyyy-MM-dd HH:mm:ss"),
                Title = c.Title,
                Duration = Convert.ToString(c.Duration),
                IsDoctorApprove = c.IsDoctorApprove
            }).ToList();

            return records;
        }

        public List<AppointmentsDto> PatientsEventsById(string patientId)
        {
            var records = _context.Appointments.Where(x => x.PatientId == patientId).ToList().Select(c => new AppointmentsDto()
            {
                Sr = c.Id,
                Desc = c.Description,
                Start_Date = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                End_Date = c.StartDate.AddMinutes(c.Duration).ToString("yyyy-MM-dd HH:mm:ss"),
                Title = c.Title,
                Duration = Convert.ToString(c.Duration),
                IsDoctorApprove = c.IsDoctorApprove
            }).ToList();

            return records;
        }



        public List<AppointmentsDto> GetAll()
        {
            var records = _context.Appointments.ToList().Select(c => new AppointmentsDto()
            {
                Sr = c.Id,
                Desc = c.Description,
                Start_Date = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                End_Date = c.StartDate.AddMinutes(c.Duration).ToString("yyyy-MM-dd HH:mm:ss"),
                Title = c.Title,
                Duration = Convert.ToString(c.Duration),
                IsClientApprove = c.IsClientApprove
            }).ToList();

            return records;
        }

        /// <summary>
        /// function to get the particular record by primary key
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public AppointmentsDto GetById(int id, string userId)
        {
            var record = _context.Appointments.Where(c => c.Id == id).Select(c => new AppointmentsDto
            {
                Sr = c.Id,
                Desc = c.Description,
                Start_Date = c.StartDate.ToString("yyyy-MM-dd hh:mm tt"),
                Title = c.Title,
                Duration = Convert.ToString(c.Duration),
                ClientId = c.ClientId,
                IsClientApprove = c.IsClientApprove,
                UserId = c.UserId,
                SelectedSlot = c.StartDate.ToString("hh:mm tt"),
                IsForClient = c.UserId == userId ? false : true,
                LoginId = userId,
                CreatorName = _context.Users.Where(x => x.Id == c.UserId).Select(x => x.Name).FirstOrDefault(),
                ClientName = _context.Users.Where(x => x.Id == c.ClientId).Select(x => x.Name).FirstOrDefault(),
                PatientId = c.PatientId,
                IsDoctorApprove = c.IsDoctorApprove,
                PatientName = _context.Users.Where(x => x.Id == c.PatientId).Select(x => x.Name).FirstOrDefault(),
                DoctorName = _context.Users.Where(x => x.Id == c.DoctorId).Select(x => x.Name).FirstOrDefault(),
            }).SingleOrDefault();

            return record;
        }

        /// <summary>
        /// function to delete the calendar record by primary key
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public int Delete(int id)
        {
            int status = 0;
            var record = _context.Appointments.Where(c => c.Id == id).FirstOrDefault();
            if (record != null)
            {
                _context.Appointments.Remove(record);
                status = _context.SaveChanges();
            }
            return status;
        }

        /// <summary>
        /// function to add update appointment
        /// </summary>
        /// <param name="model"></param>
        /// <param name="userId"></param>
        /// <returns></returns>
        public async Task<int> AddUpdate(AppointmentsDto model, string userId)
        {
            

            var startDate = DateTime.Parse(model.Start_Date);
            var endDate = DateTime.Parse(model.Start_Date).AddMinutes(Convert.ToDouble(model.Duration));
            var isOverLap = CheckAppoinmentOverlap(startDate, endDate, model.Sr, model.DoctorId);
            if (isOverLap)
            {
                //overlap condition true
                return -1;
            }

            if (model != null && model.Sr > 0)
            {
                //code to update the appointment
                var appointment = _context.Appointments.FirstOrDefault(x => x.Id == model.Sr);
                appointment.Title = model.Title;
                appointment.Description = model.Desc;
                appointment.StartDate = startDate;
                appointment.EndDate = startDate.AddMinutes(Convert.ToInt32(model.Duration));
                appointment.Duration = Convert.ToInt32(model.Duration);
                appointment.DoctorId = model.DoctorId;
                appointment.PatientId = model.PatientId;
                _context.SaveChanges();

                //code to send the email here
                //SendNotificationEmail(appointment, false);
                return 1;
            }
            else
            {
                //code to add the appointment
                Appointment appointment = new Appointment();
                appointment.Title = model.Title;
                appointment.Description = model.Desc;
                appointment.StartDate = startDate;
                appointment.EndDate = startDate.AddMinutes(Convert.ToInt32(model.Duration));
                appointment.Duration = Convert.ToInt32(model.Duration);
                appointment.DoctorId = model.DoctorId;
                appointment.PatientId = model.PatientId;
                _context.Appointments.Add(appointment);
                _context.SaveChanges();
                //code to send the email here
                await SendNotificationEmail(appointment, true);
                return 2;
            }
        }

        /// <summary>
        /// Function to check if appointment overlaps
        /// </summary>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="id"></param>
        /// <returns>bool</returns>
        private bool CheckAppoinmentOverlap(DateTime start, DateTime end, int appointmentId, string doctorId)
        {
            var records = _context.Appointments.Where(x => x.DoctorId == doctorId).ToList().Select(c => new AppointmentsDto()
            {
                Sr = c.Id,
                Start_Date = c.StartDate.ToString("yyyy-MM-dd HH:mm:ss"),
                End_Date = c.StartDate.AddMinutes(c.Duration).ToString("yyyy-MM-dd HH:mm:ss")

            }).ToList();

            //meand its in update mode
            if (appointmentId > 0)
            {
                //exclude the existing one
                records = records.Where(c => c.Sr != appointmentId).ToList();
            }

            if (records.Any())
            {
                foreach (var item in records)
                {
                    var startAppoiment = DateTime.Parse(item.Start_Date);
                    var endAppoiment = DateTime.Parse(item.End_Date);

                    if (((start >= startAppoiment && start <= endAppoiment) || (end >= startAppoiment && end <= endAppoiment)))
                    {
                        return true;
                    }
                }
            }
            return false;
        }

        /// <summary>
        /// Function to get list of user
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public List<UserVM> GetUser(string userId)
        {
            var users = (from user in _context.Users
                         join userRoles in _context.UserRoles on user.Id equals userRoles.UserId
                         join roles in _context.Roles.Where(x => x.Name == Helper.user) on userRoles.RoleId equals roles.Id
                         where user.Id != userId
                         select new UserVM
                         {
                             Id = user.Id,
                             Name = user.Name
                         }).ToList();

            return users;
        }

        /// <summary>
        /// Function to get available time slots
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public List<TimeSlotOutputVM> GetTimeSlots(TimeSlotInputVM input)
        {
            var appoinmentDate = DateTime.Parse(input.EventDate).Date;

            var settings = _context.Settings.Where(x => x.UserId == input.ClientId).FirstOrDefault();

            if (settings != null)
            {
                var startDate = DateTime.Parse(input.EventDate + " " + settings.StartTime);
                var endDate = DateTime.Parse(input.EventDate + " " + settings.EndTime);

                //var allSlots = new List<TimeSlot>();
                var clientAppoinment = _context.Appointments.Where(x => (x.ClientId == input.ClientId || x.UserId == input.ClientId) && x.StartDate >= startDate && x.EndDate <= endDate).ToList();

                var slots = new List<TimeSlotOutputVM>();
                //edit mode
                if (input.AppointmentId > 0)
                {
                    clientAppoinment = clientAppoinment.Where(x => x.Id != input.AppointmentId).ToList();
                }

                //var differnce = "30";
                var tempEndDate = startDate.AddMinutes(Convert.ToDouble(input.Duration));
                while (startDate < endDate)
                {
                    if (clientAppoinment.Any())
                    {
                        var isStartTime = clientAppoinment.Where(x => x.StartDate == startDate).ToList();
                        var isEndTime = clientAppoinment.Where(x => x.EndDate == tempEndDate).ToList();

                        if (isStartTime.Count == 0 && isEndTime.Count == 0)
                        {
                            // check meeting endtime exceed
                            var meetingEndTime = startDate.AddMinutes(Convert.ToDouble(input.Duration));
                            if (meetingEndTime > endDate)
                            {

                            }
                            else
                            {
                                slots.Add(new TimeSlotOutputVM()
                                {
                                    TimeSlot = startDate.ToString("hh:mm tt"),
                                    TimeSlotDate = startDate.ToString("yyyy-MM-dd hh:mm tt"),
                                    start = startDate,
                                    end = startDate.AddMinutes(Convert.ToDouble(input.Duration))
                                });
                            }
                        }
                        else
                        {
                            // no require to add slot
                        }
                    }
                    else
                    {
                        slots.Add(new TimeSlotOutputVM()
                        {
                            TimeSlot = startDate.ToString("hh:mm tt"),
                            TimeSlotDate = startDate.ToString("yyyy-MM-dd hh:mm tt"),
                            start = startDate,
                            end = startDate.AddMinutes(Convert.ToDouble(input.Duration))
                        });
                    }
                    startDate = startDate.AddMinutes(Convert.ToDouble(input.Duration));
                    tempEndDate = startDate.AddMinutes(Convert.ToDouble(input.Duration));
                }

                // code for overlapping

                //var op = new List<TimeSlotOutputVM>();
                //foreach(var item in slots)
                //{
                //    var test = clientAppoinment.Where(x =>x.StartDate < item.start && x.EndDate > item.end).ToList();

                //    if (test.Count == 0)
                //    {
                //        op.Add(item);
                //    }
                //}

                return slots;
            }
            else
            {
                return new List<TimeSlotOutputVM>();
            }
        }

        /// <summary>
        /// Function to send email
        /// </summary>
        /// <param name="emailToClientId"></param>
        /// <param name="firstTime"></param>
        /// <param name="emailFromClientId"></param>

        
        public async Task SendNotificationEmail(Appointment appointmentsDto, bool firstTime)
        {
            try
            {
                
                var doctor = _context.Users.Where(c => c.Id == appointmentsDto.DoctorId).FirstOrDefault();
                var patient = _context.Users.Where(c => c.Id == appointmentsDto.PatientId).FirstOrDefault();

                if (firstTime)
                {
                    // Send mail to doctor
                    var subject = "New appoinment Request -" + appointmentsDto.StartDate.ToShortDateString();
                    var html = "Hi " + doctor.Name + ", <br>";
                    html += "You have an appoinment request on " + appointmentsDto.StartDate.ToShortDateString() + " at " + appointmentsDto.StartDate.ToShortTimeString() + " with " + patient.Name + "<br>";
                    html += "<br>Thanks<br>";

                    HtmlString htmlStringPatient = new HtmlString(html);

                    var email = new MimeMessage();
                    email.Sender = MailboxAddress.Parse(_configuration["SMTPConfig:sender"]);
                    email.To.Add(MailboxAddress.Parse(doctor.Email));
                    email.Subject = subject;
                    email.Body = new TextPart(TextFormat.Html) { Text = htmlStringPatient.Value };

                    // send email
                    var smtp = new MailKit.Net.Smtp.SmtpClient();
                    smtp.Connect(_configuration["SMTPConfig:smtp"], Convert.ToInt32(_configuration["SMTPConfig:port"]), SecureSocketOptions.StartTls);
                    smtp.Authenticate(_configuration["SMTPConfig:username"], _configuration["SMTPConfig:password"]);
                    await smtp.SendAsync(email);
                    smtp.Disconnect(true);


                    // Send mail to patient
                    subject = "New appoinment -" + appointmentsDto.StartDate.ToShortDateString();
                    html = "Hi " + patient.Name + ",<br>";
                    html += "You have an scheduled appointment with " + doctor.Name + " on " + appointmentsDto.StartDate.ToShortDateString() + " at " + appointmentsDto.StartDate.ToShortTimeString() + "<br>";
                    html += "We are waiting for the doctor to confirm it.<br>";
                    html += "We will notify you as soon as your appointment will be confirmed by the doctor.<br>";
                    html += "<br>Thanks<br>";


                    HtmlString htmlString = new HtmlString(html);

                    email = new MimeMessage();
                    email.Sender = MailboxAddress.Parse(_configuration["SMTPConfig:sender"]);
                    email.To.Add(MailboxAddress.Parse(patient.Email));
                    email.Subject = subject;
                    email.Body = new TextPart(TextFormat.Html) { Text = htmlString.Value };

                    // send email
                    smtp = new MailKit.Net.Smtp.SmtpClient();
                    smtp.Connect(_configuration["SMTPConfig:smtp"], Convert.ToInt32(_configuration["SMTPConfig:port"]), SecureSocketOptions.StartTls);
                    smtp.Authenticate(_configuration["SMTPConfig:username"], _configuration["SMTPConfig:password"]);
                    await smtp.SendAsync(email);
                    smtp.Disconnect(true);
                }
                else
                {
                    // Send confirm mail to patient
                    var subject = "Confirmed appoinment -" + appointmentsDto.StartDate.ToShortDateString();
                    var html = "Hi " + patient.Name + ",<br>";
                    html += "Your appointment with " + doctor.Name + " on " + appointmentsDto.StartDate.ToShortDateString() + " at " + appointmentsDto.StartDate.ToShortTimeString() + " is confirmed.<br>";
                    html += "<br>Thanks<br>";

                    var email = new MimeMessage();
                    email.Sender = MailboxAddress.Parse(_configuration["SMTPConfig:sender"]);
                    email.To.Add(MailboxAddress.Parse(patient.Email));
                    email.Subject = subject;

                    var bodyBuilder = new BodyBuilder
                    {
                        HtmlBody = html
                    };

                    email.Body = bodyBuilder.ToMessageBody();

                    // send email
                    using var smtp = new MailKit.Net.Smtp.SmtpClient();
                    smtp.Connect(_configuration["SMTPConfig:smtp"], Convert.ToInt32(_configuration["SMTPConfig:port"]), SecureSocketOptions.StartTls);
                    smtp.Authenticate(_configuration["SMTPConfig:username"], _configuration["SMTPConfig:password"]);
                    await smtp.SendAsync(email);
                    smtp.Disconnect(true);
                }
            }
            catch (SmtpException mex)
            {
                //In case of smtp exception (due to network oor wrong smtp)
                string err = mex.Message;
            }
            catch (Exception ex)
            {
                string err = ex.Message;
            }
        }

        /// <summary>
        /// Function for confirm the event
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public async Task<int> ConfirmEvent(int id)
        {
            var appointment = _context.Appointments.FirstOrDefault(x => x.Id == id);
            if (appointment != null)
            {
                //appointment.IsClientApprove = true;
                appointment.IsDoctorApprove = true;
                var ret = _context.SaveChanges();

                if (ret > 0)
                {
                    await SendNotificationEmail(appointment, false);
                }
                return ret;
            }
            return 0;
        }

        /// <summary>
        /// Function to get patient list
        /// </summary>
        /// <returns></returns>
        public List<PatientVM> GetPatientList()
        {
            var patients = (from user in _context.Users
                            join userRoles in _context.UserRoles on user.Id equals userRoles.UserId
                            join roles in _context.Roles.Where(x => x.Name == Helper.patient) on userRoles.RoleId equals roles.Id
                            select new PatientVM
                            {
                                Id = user.Id,
                                Name = user.Name
                            }).ToList();

            return patients;
        }

        /// <summary>
        /// Function to get doctor list
        /// </summary>
        /// <returns></returns>
        public List<DoctorVM> GetDoctorList()
        {
            var doctors = (from user in _context.Users
                           join userRoles in _context.UserRoles on user.Id equals userRoles.UserId
                           join roles in _context.Roles.Where(x => x.Name == Helper.doctor) on userRoles.RoleId equals roles.Id
                           select new DoctorVM
                           {
                               Id = user.Id,
                               Name = user.Name
                           }).ToList();

            return doctors;
        }
    }
}
