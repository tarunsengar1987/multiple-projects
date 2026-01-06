var routeURL = location.protocol + '//' + location.host;
var selectedSlot = null;
var isConfirmMode = false;
$(document).ready(function () {

    GetUserList();

    $("#appstart").kendoDatePicker({
        dateInput: true,
        change: GetTimeSlots
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
                                        backgroundColor: data.isClientApprove ? "#28a745" : "#dc3545",
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
        $("#description").val(obj.desc);
        $("#Duration").val(obj.duration);
        $("#append").val(obj.end_Date);
        $("#id").val(obj.sr);
        $("#appstart").data("kendoDatePicker").value(obj.start_Date);
        $('#clientId').val(obj.clientId);
        selectedSlot = obj.start_Date;
        if (obj.clientId === obj.loginId) {
            isConfirmMode = true;
            $("#divUserList").addClass("d-none")
            $("#divAvailableSlots").addClass("d-none")
            $("#divSlotTime").removeClass("d-none")
            $("#divUserName").removeClass("d-none")
            $("#slotTime").html("Time : " + obj.start_Date)
            $("#userName").html('Meeting with: ' + obj.creatorName);
            $('#appstart').prop('disabled', 'disabled');
            $('#Duration').prop('disabled', 'disabled');
            $('#title').prop('disabled', 'disabled');
            $('#description').prop('disabled', 'disabled');
            $("#btnSubmit").addClass("d-none");

            // confirm button
            if (obj.isClientApprove) {
                $("#btnConfirm").addClass("d-none");
            } else {
                $("#btnConfirm").removeClass("d-none");
            }
        }
        else {
            if (obj.isClientApprove) {
                $("#divUserList").addClass("d-none")
                $('#title').prop('disabled', 'disabled');
                $('#description').prop('disabled', 'disabled');
                $("#btnSubmit").addClass("d-none");
                $('#clientId').prop('disabled', 'disabled');
                $('#appstart').prop('disabled', 'disabled');
                $('#Duration').prop('disabled', 'disabled');
                $("#divSlotTime").removeClass("d-none")
                $("#divUserName").removeClass("d-none")
                $("#slotTime").html("Time : " + obj.start_Date)
                $("#userName").html('Meeting with: ' + obj.clientName);
                $("#divAvailableSlots").addClass("d-none")
            } else {
                $("#btnSubmit").removeClass("d-none");
            }
        }
    } else {
        if (obj._i !== undefined) {
            let dateArray = obj._i
            let dateObject = new Date(...dateArray);
            $("#appstart").data("kendoDatePicker").value(dateObject);
        } else {
            $("#appstart").data("kendoDatePicker").value(obj._d);
        }
        $("#id").val(0);
        $('#clientId').prop('disabled', false);
        $("#btnSubmit").removeClass("d-none");

    }
    $('.select2').select2();
    $("#appointmentInput").modal("show");
    GetTimeSlots();
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
    selectedSlot = null;

    $("#divAvailableSlots").removeClass("d-none")
    $("#divSlotTime").addClass("d-none")
    $("#divUserName").addClass("d-none")
    $("#slotTime").html('');
    $("#userName").html('');

    $('#clientId').prop('disabled', false);
    $('#appstart').prop('disabled', false);
    $('#Duration').prop('disabled', false);
    $("#btnSubmit").removeClass("d-none");
    $("#divUserList").removeClass("d-none")
    $('#title').prop('disabled', false);
    $('#description').prop('disabled', false);
    $("#btnConfirm").addClass("d-none");
    isConfirmMode = false;
}

// Add/Update Appoinment
function SubmitForm() {
    if (Validation()) {
        if (!isConfirmMode) {
            selectedSlot = $("input[name='slotGroup']:checked").val();
            if (selectedSlot === undefined || selectedSlot === null) {
                alert("Please select time slot")
                return false;
            }
        }

        var requestData = {
            Sr: parseInt($("#id").val()),
            Title: $("#title").val(),
            Desc: $("#description").val(),
            Start_Date: selectedSlot,
            Duration: $("#Duration").val(),
            ClientId: $("#clientId").val(),
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

// Get User list
function GetUserList() {
    $.ajax({
        url: routeURL + '/api/Appointment/GetUser',
        type: "GET",
        dataType: "JSON",
        success: function (response) {
            if (response.status === 1) {
                var item = "";
                $.each(response.dataenum, function (i, user) {
                    item += '<option value="' + user.id + '">' + user.name + '</option>'
                });

                $("#clientId").html(item);
            } else {

            }
        }
    });
}


// Get Time Slots
function GetTimeSlots() {
    var requestData = {
        ClientId: $("#clientId").val(),
        EventDate: $("#appstart").val(),
        Duration: $("#Duration").val(),
        AppointmentId: parseInt($("#id").val())
    };
    $.ajax({
        url: routeURL + '/api/Appointment/GetTimeSlots',
        type: "POST",
        data: JSON.stringify(requestData),
        contentType: 'application/json',
        success: function (response) {
            if (response.status === 1 && response.dataenum.length > 0) {
                var htmlStr = bindSlots(response.dataenum);
                $("#divSlots").html(htmlStr)
            } else {
                $("#divSlots").html('<div class="col-sm-12">No any slots are available </div>')
            }
        }
    });
}

// Bind slots
function bindSlots(slots) {
    var htmlString = ""
    for (var i = 0; i < slots.length; i++) {
        htmlString += '<div class="col-sm-3">'
        htmlString += '<label class="radio-container">'
        if (selectedSlot === slots[i]["timeSlotDate"]) {
            htmlString += '<input type="radio" name="slotGroup" value="' + slots[i]["timeSlotDate"] + '" checked="checked">'
        } else {
            htmlString += '<input type="radio" name="slotGroup" value="' + slots[i]["timeSlotDate"] + '">'
        }
        htmlString += '<span class="checkmark">' + slots[i]["timeSlot"] + '</span>'
        htmlString += '</div>'
    }
    return htmlString;
}

// On confirm meeting
function OnConfirm() {
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
                CloseModal();
            } else {
                $.notify(response.message, "error");
            }
        }
    });
}
