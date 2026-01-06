using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.ViewModel
{
    public class SettingsVM
    {
        public string UserId { get; set; }
        public bool IsAutoAcceptAppointment { get; set; }
        public string StartTime { get; set; } = "08:00 AM";
        public string EndTime { get; set; } = "08:00 PM";
        public bool SendEmailNotification { get; set; }

    }
}
