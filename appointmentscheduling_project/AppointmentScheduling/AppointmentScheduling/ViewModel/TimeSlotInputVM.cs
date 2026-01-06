using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.ViewModel
{
    public class TimeSlotInputVM
    {
        public string ClientId { get; set; }
        public string EventDate { get; set; } 
        public string Duration{ get; set; } 
        public int AppointmentId { get; set; }
    }

    public class TimeSlotOutputVM
    {
        public string TimeSlot { get; set; }
        public string TimeSlotDate { get; set; }
        public DateTime start { get; set; }
        public DateTime end { get; set; }
    }

    public class TimeSlot
    {
        public string Time { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
