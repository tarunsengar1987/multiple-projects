var routeURL = location.protocol + '//' + location.host;
$(document).ready(function () {

    $("#appstart").kendoDateTimePicker({
        value: new Date(),
        dateInput: false,
    });

    InitializeCalendar();

    $('#appointmentInput').on('hidden.bs.modal', function () {
        $("#title").removeClass('error')
        $("#appstart").removeClass('error')
        $("#deleteBtn").addClass('hidden')
    })

    
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
                
                ShowModal(event, null);
            },

            events: function (start, end, timezone, callback) {
                $.ajax({
                    url: routeURL + '/api/Appointment/GetCalendarData',
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
                                        backgroundColor: "#162466",
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
                GetEventDetailsByEventId(info);
            },
        });
    } catch (e) {
        alert(e);
    }

}

// Show Modal
function ShowModal(obj, isEventDetail) {
    if (isEventDetail != null) {
        $("#title").val(obj.title);
        $("#appdetais").val(obj.desc);
        $("#appstart").val(obj.start_Date);
        $("#Duration").val(obj.duration);
        $("#append").val(obj.end_Date);
        $("#id").val(obj.sr);
        $("#appstart").data("kendoDateTimePicker").value(new Date(obj.start_Date))
    } else {
        if (obj._i !== undefined) {
            let dateArray = obj._i
            let dateObject = new Date(...dateArray);
            $("#appstart").data("kendoDateTimePicker").value(dateObject);
        } else {
            $("#appstart").data("kendoDateTimePicker").value(obj._d);
        }
        $("#id").val(0);
    }
    $("#appointmentInput").modal("show");
}

// Get Appoinment Details By Id
function GetEventDetailsByEventId(info) {
    $.ajax({
        type: "GET",
        url: routeURL + '/api/Appointment/GetCalendarDataById/' + info.id,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.status === 1 && response.dataenum !== undefined) {
                $("#deleteBtn").removeClass('hidden')
                ShowModal(response.dataenum, true);
            } else {
                $.notify(response.message, "error");
            }
        }
    });
}

// Close Modal
function CloseModal() {
    $("#frmapp")[0].reset();
    $("#id").val(0);
    $("#appointmentInput").modal("hide");
}

// Add/Update Appoinment
function SubmitForm() {
    if (Validation()) {
        var requestData = {
            Sr: parseInt($("#id").val()),
            Title: $("#title").val(),
            Desc: $("#appdetais").val(),
            Start_Date: new Date($("#appstart").val()),
            Duration: $("#Duration").val()
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
                    CloseModal();
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
function DeleteAppoinment() {
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
                CloseModal();
            } else {
                $.notify(response.message, "error");
            }
        }
    });
}

// Validation
function Validation() {
    let isValid = true
    if ($("#title").val() === undefined || $("#title").val().trim() === "") {
        isValid = false;
        $("#title").addClass('error')
    } else {
        $("#title").removeClass('error')
    }

    if ($("#appstart").val() === "" || $("#appstart").val() === undefined) {
        isValid = false;
        $("#appstart").addClass('error')
    } else {
        $("#appstart").removeClass('error')
    }
    return isValid;
}
