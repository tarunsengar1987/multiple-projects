var studentId = 0;
var routeURL = location.protocol + '//' + location.host;

function onCreate() {
    studentId = 0;
    $(".modal-title").html("Student - Add")
    $('#studentModal').modal('show');
}

function onEdit(id) {

    // GET Request
    $.ajax({
        url: routeURL + '/api/Student/' + id,
        type: 'GET',
        success: function (result) {
            if (result.status == 1) {
                studentId = id;
                var data = result.dataenum;
                $('#txtFirstName').val(data.firstName);
                $('#txtLastName').val(data.lastName);
                $('#dateOfBirth').val(data.dateOfBirth);
                $('#bloodGroup').val(data.bloodGroup);
                $('input:radio[name="gender"][value="' + data.gender + '"]').attr('checked', true);
                $(".modal-title").html("Student - Edit")
                $('#studentModal').modal('show');
            } else {
                reset();
                alert(result.message)
            }
        },
        error: function (xhr) {
            reset();
            alert("Error", xhr.statusText);
        }
    });
}

function onDelete(id) {
    if (confirm('Are you sure you want to delete the seleted student?')) {

        // Delete Request
        $.ajax({
            url: routeURL + '/api/Student/' + id,
            type: 'DELETE',
            success: function (result) {
                if (result.status == 1) {
                    alert(result.message)
                    location.reload();
                } else {
                    alert(result.message)
                }
            },
            error: function (xhr) {
                alert("Error", xhr.statusText);
            }
        });
    }
}

function onSubmit() {
    var student = {
        Id: studentId,
        FirstName: $('#txtFirstName').val(),
        LastName: $("#txtLastName").val(),
        DateOfBirth: $("#dateOfBirth").val(),
        Gender: $('input[name="gender"]:checked').val(),
        BloodGroup: $("#bloodGroup").val(),
    };
    if (studentId > 0) {

        // PUT Request
        $.ajax({
            url: routeURL + '/api/Student?id=' + studentId,
            type: 'PUT',
            data: JSON.stringify(student),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                if (result.status == 1) {
                    alert(result.message);
                    location.reload();
                } else {
                    alert(result.message);
                }
            },
            error: function (xhr) {
                reset()
                alert("Error", xhr.statusText);
            }
        });
    }
    else {

        // POST Request
        $.ajax({
            url: routeURL + '/api/Student',
            type: 'POST',
            data: JSON.stringify(student),
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
                if (result.status == 1) {
                    alert(result.message);
                    location.reload();
                } else {
                    alert(result.message);
                }
            },
            error: function (xhr) {
                reset()
                alert("Error", xhr.statusText);
            }
        });
    }
}

function onClose() {
    reset()
}

function reset() {
    studentId = 0;
    $('#studentModal').modal('hide');
    $('#txtFirstName').val('')
    $('#txtLastName').val('')
    $('#dateOfBirth').val('')
    $('#bloodGroup').val('A')
    $('input:radio[name="gender"][value="Male"]').attr('checked', true);

    $(".modal-title").html("Student - Add")
}