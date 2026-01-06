using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class modify_appointment_2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "95e4b0ff-1b23-476d-a071-ffae61d0bb5e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bc589190-2c1d-4473-953a-349ced740653");

            migrationBuilder.AddColumn<bool>(
                name: "IsClientApprove",
                table: "Appointments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "be5fc6f7-adc1-4d0f-a56a-1e48f2f82d9f", "4fe49c86-a5f4-468c-86f6-0bca3f5c3f81", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "add96ac5-e43d-4a62-a617-8866223b59ff", "1420e992-ea43-4ce8-b205-205c66a43529", "User", "USER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "add96ac5-e43d-4a62-a617-8866223b59ff");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "be5fc6f7-adc1-4d0f-a56a-1e48f2f82d9f");

            migrationBuilder.DropColumn(
                name: "IsClientApprove",
                table: "Appointments");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "95e4b0ff-1b23-476d-a071-ffae61d0bb5e", "79e02d4a-475f-4efb-9ac1-0d063b53d3a0", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "bc589190-2c1d-4473-953a-349ced740653", "b3d05b66-9a89-453d-9534-4e24d0765949", "User", "USER" });
        }
    }
}
