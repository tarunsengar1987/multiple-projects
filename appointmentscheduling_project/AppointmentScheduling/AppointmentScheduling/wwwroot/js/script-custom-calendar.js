var routeURL = location.protocol + '//' + location.host;
$(document).ready(function () {
    $("#appointmentDate").kendoDateTimePicker({
        value: new Date(),
        dateInput: false,
    });

    InitializeCalendar();
});

// Initialize Calendar
function InitializeCalendar() {
    try {
        $('#calendar').fullCalendar({
            timezone: false,
            header:
            {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            buttonText: {
                today: 'today',
                month: 'month',
                week: 'week',
                day: 'day'
            },
            selectable: true,
            select: function (event) {
                var doctorId = $("#doctorId").val()
                if (doctorId !== undefined) {
                    onShowModal(event, null);
                }
            },

            events: function (start, end, timezone, callback) {
                $.ajax({
                    url: routeURL + '/api/Appointment/GetCalendarData?doctorId=' + $("#doctorId").val(),
                    type: "GET",
                    dataType: "JSON",
                    success: function (response) {
                        var events = [];
                        if (response.status === 1) {
                            $.each(response.dataenum, function (i, data) {
                                events.push(
                                    {
                                        title: data.title,
                                        description: data.desc,
                                        start: data.start_Date,
                                        end: data.end_Date,
                                        backgroundColor: data.isDoctorApprove ? "#28a745" : "#dc3545",
                                        borderColor: "#162466",
                                        textColor: "white",
                                        id: data.sr
                                    });
                            });
                        }
                        callback(events);
                    }
                });
            },

            eventRender: function (event, element) {

                element.qtip(
                    {
                        content: event.description
                    });
            },

            editable: false,
            droppable: true,
            nowIndicator: true,
            eventClick: function (info) {
                getEventDetailsByEventId(info);
            },
        });
    } catch (e) {
        alert(e);
    }

}

// Show Modal
function onShowModal(obj, isEventDetail) {
    if (isEventDetail != null) {
        $("#title").val(obj.title);
        $("#description").val(obj.desc);
        $("#appointmentDate").val(obj.start_Date);
        $("#duration").val(obj.duration);
        $("#append").val(obj.end_Date);
        $("#id").val(obj.sr);
        $("#patientId").val(obj.patientId);
        if (obj.isDoctorApprove) {
            $("#btnConfirm").addClass("d-none");
            $("#btnSubmit").addClass("d-none");
            $("#lblStatus").html('Approved')
        } else {
            $("#lblStatus").html('Pending')
            $("#deleteBtn").removeClass('hidden')
        }

        $("#lblTitle").html(obj.title)
        $("#lblDescription").html(obj.desc)
        $("#lblDateTime").html(obj.start_Date)
        $("#lblDuration").html(obj.duration)
        $("#lblPatientName").html(obj.patientName)
        $("#lblDoctorName").html(obj.doctorName)


    } else {
        try {
            if (obj._i !== undefined) {
                let dateArray = obj._i
                let dateObject = new Date(...dateArray);
                $("#appointmentDate").data("kendoDateTimePicker").value(dateObject);
            } else {
                $("#appointmentDate").data("kendoDateTimePicker").value(obj._d);
            }
        } catch{

        }
        
        $("#id").val(0);
    }
    $("#appointmentInput").modal("show");
}

// Get Appoinment Details By Id
function getEventDetailsByEventId(info) {
    $.ajax({
        type: "GET",
        url: routeURL + '/api/Appointment/GetCalendarDataById/' + info.id,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.status === 1 && response.dataenum !== undefined) {
               
                onShowModal(response.dataenum, true);
            } else {
                $.notify(response.message, "error");
            }
        }
    });
}

// Close Modal
function onCloseModal() {
    $("#appointmentForm")[0].reset();
    $("#id").val(0);
    $("#deleteBtn").addClass('hidden');
    $("#btnConfirm").removeClass("d-none");
    $("#btnSubmit").removeClass("d-none");
    $("#title").removeClass('error')
    $("#appointmentDate").removeClass('error')

    $("#lblTitle").html('')
    $("#lblDescription").html('')
    $("#lblDateTime").html('')
    $("#lblDuration").html('')
    $("#lblPatientName").html('')
    $("#lblDoctorName").html('')
    $("#lblStatus").html('')

    $("#appointmentInput").modal("hide");
}

// Add/Update Appoinment
function onSubmitForm() {
    if (checkValidation()) {
        var requestData = {
            Sr: parseInt($("#id").val()),
            Title: $("#title").val(),
            Desc: $("#description").val(),
            Start_Date: new Date($("#appointmentDate").val()),
            Duration: $("#duration").val(),
            DoctorId: $("#doctorId").val(),
            PatientId: $("#patientId").val()
        };
        $.ajax({
            url: routeURL + '/api/Appointment/SaveCalendarData',
            type: 'POST',
            data: JSON.stringify(requestData),
            contentType: 'application/json',
            success: function (response) {
                if (response.status === 1) {
                    $('#calendar').fullCalendar('removeEvents');
                    $('#calendar').fullCalendar('refetchEvents');
                    $.notify(response.message, "success");
                    onCloseModal();
                } else {
                    $.notify(response.message, "error");
                }
            },
            error: function (xhr) {
                $.notify("Error", "error");
            },
        });
    }
}

// Delete Appoinment
function onDeleteAppoinment() {
    var id = parseInt($("#id").val())
    $.ajax({
        type: "GET",
        url: routeURL + '/api/Appointment/DeleteAppoinment/' + id,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.status === 1) {
                $.notify(response.message, "success");
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('refetchEvents');
                onCloseModal();
            } else {
                $.notify(response.message, "error");
            }
        }
    });
}

// Validation
function checkValidation() {
    let isValid = true
    if ($("#title").val() === undefined || $("#title").val().trim() === "") {
        isValid = false;
        $("#title").addClass('error')
    } else {
        $("#title").removeClass('error')
    }

    if ($("#appointmentDate").val() === "" || $("#appointmentDate").val() === undefined) {
        isValid = false;
        $("#appointmentDate").addClass('error')
    } else {
        $("#appointmentDate").removeClass('error')
    }
    return isValid;
}

// Confirm Appointment
function onConfirm() {
    $.ajax({
        type: "GET",
        url: routeURL + '/api/Appointment/ConfirmEvent/' + parseInt($("#id").val()),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.status === 1) {
                $.notify(response.message, "success");
                $('#calendar').fullCalendar('removeEvents');
                $('#calendar').fullCalendar('refetchEvents');
                onCloseModal();
            } else {
                $.notify(response.message, "error");
            }
        }
    });
}

// Doctor Change
function onDoctorChange() {
    $('#calendar').fullCalendar('removeEvents');
    $('#calendar').fullCalendar('refetchEvents');
}
