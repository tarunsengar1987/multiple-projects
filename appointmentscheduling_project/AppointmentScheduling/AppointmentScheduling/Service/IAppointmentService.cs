using AppointmentScheduling.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppointmentScheduling.Service
{
    public interface IAppointmentService
    {
        public List<AppointmentsDto> GetAllByUserId(string userId);
        public AppointmentsDto GetById(int id, string userId);
        public int Delete(int id);
        public Task<int> AddUpdate(AppointmentsDto model, string userId);
        public List<UserVM> GetUser(string userId);
        //public List<TimeSlotOutputVM> GetTimeSlots(TimeSlotInputVM input);
        public List<AppointmentsDto> GetAll();
        public Task<int> ConfirmEvent(int id);
        public List<PatientVM> GetPatientList();
        public List<DoctorVM> GetDoctorList();
        public List<AppointmentsDto> DoctorsEventsById(string doctorId);
        public List<AppointmentsDto> PatientsEventsById(string patientId);

    }
}
