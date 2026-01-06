using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.Models
{
    public class Settings
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string UserId { get; set; }
        public bool IsAutoAcceptAppointment { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public bool SendEmailNotification { get; set; }
    }
}
