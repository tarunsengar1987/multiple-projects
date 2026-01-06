using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.Utility
{
    public class Helper
    {
        public static int success_code = 1;
        public static int failure_code = 0;

        public static string appointmentAdded = "Appointment added successfully.";
        public static string appointmentUpdated = "Appointment updated successfully.";
        public static string appointmentDeleted = "Appointment deleted successfully.";
        public static string appointmentExists = "Appointment for selected date and time already exists.";
        public static string appointmentNotExists = "Appointment not exists.";

        public static string appointmentAddError = "Something went wront, Please try again.";
        public static string appointmentUpdatError = "Something went wront, Please try again.";
        public static string somethingWentWrong = "Something went wront, Please try again.";

        public static string meetingConfirm = "Meeting confirm successfully.";
        public static string meetingConfirmError = "Meeting confirm successfully.";

        // Roles
        public static string admin = "Admin";
        //public static string moderator = "Moderator";
        public static string user = "User";
        public static string doctor = "Doctor";
        public static string patient = "Patient";

        public static List<SelectListItem> GetTimeDropDown()
        {
            int minute = 60;
            List<SelectListItem> duration = new List<SelectListItem>();
            for (int i = 1; i <= 12; i++)
            {
                duration.Add(new SelectListItem { Value = minute.ToString(), Text = i + " Hr" });
                minute = minute + 30;
                duration.Add(new SelectListItem { Value = minute.ToString(), Text = i + " Hr 30 min" });
                minute = minute + 30;
            }
            //duration.Add(new SelectListItem { Value = "30", Text = "30 min" });
            //duration.Add(new SelectListItem { Value = "60", Text = "1 Hr" });
            return duration;
        }

        public static List<SelectListItem> GetRoleDropDown()
        {
            List<SelectListItem> roles = new List<SelectListItem>();
            roles.Add(new SelectListItem { Value = Helper.admin, Text = Helper.admin });
            //roles.Add(new SelectListItem { Value = Helper.user, Text = Helper.user });
            roles.Add(new SelectListItem { Value = Helper.doctor, Text = Helper.doctor });
            roles.Add(new SelectListItem { Value = Helper.patient, Text = Helper.patient });
            return roles;
        }
    }
}
