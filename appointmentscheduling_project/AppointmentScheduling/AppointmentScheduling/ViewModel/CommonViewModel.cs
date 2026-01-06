using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AppointmentScheduling.ViewModel
{
    public class AppointmentsDto
    {
        public int Sr { get; set; }
        public string Title { get; set; }
        public string Desc { get; set; }
        public string Start_Date { get; set; }
        public string End_Date { get; set; }
        public string Duration { get; set; }
        public string UserId { get; set; }
        public string ClientId { get; set; }
        public bool IsClientApprove { get; set; }
        public bool IsForClient { get; set; }
        public string SelectedSlot { get; set; }
        public string LoginId { get; set; }
        public string ClientName{ get; set; }
        public string CreatorName { get; set; }
        public string DoctorId { get; set; }
        public string PatientId { get; set; }
        public string DoctorName { get; set; }
        public string PatientName { get; set; }
        public bool IsDoctorApprove { get; set; }
    }

    public class CommonResponse<T>
    {
        public int status { get; set; }
        public string message { get; set; }
        public T dataenum { get; set; }
    }
}