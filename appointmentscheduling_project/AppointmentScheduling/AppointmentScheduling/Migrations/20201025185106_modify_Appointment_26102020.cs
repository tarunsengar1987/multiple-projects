using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class modify_Appointment_26102020 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "42a2784c-66a8-4ec5-b474-86283c188118");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "78de89a7-1887-419f-ad4c-6e9b8f915cb1");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "88047146-85c2-47bc-9431-29cc116b775a");

            migrationBuilder.AddColumn<string>(
                name: "DoctorId",
                table: "Appointments",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDoctorApprove",
                table: "Appointments",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PatientId",
                table: "Appointments",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "13824aee-e9ac-4bc8-934f-3bde8afbe64b", "17a1bdd2-221c-45e1-8f25-4b20489723ed", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "c93414fe-2330-4658-833d-cb3c73278f1f", "726fa418-e037-4024-8b03-59959dcab23a", "Doctor", "DOCTOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "632ce1a1-7fe7-438f-8003-cadf910b733f", "a6953462-7dd4-4503-93f9-0142188108e0", "Patient", "PATIENT" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "13824aee-e9ac-4bc8-934f-3bde8afbe64b");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "632ce1a1-7fe7-438f-8003-cadf910b733f");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c93414fe-2330-4658-833d-cb3c73278f1f");

            migrationBuilder.DropColumn(
                name: "DoctorId",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "IsDoctorApprove",
                table: "Appointments");

            migrationBuilder.DropColumn(
                name: "PatientId",
                table: "Appointments");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "42a2784c-66a8-4ec5-b474-86283c188118", "b2f4a713-5219-4608-8db2-2296a20e3be3", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "88047146-85c2-47bc-9431-29cc116b775a", "1e34a553-dad0-49fd-b563-8818bbffaca1", "Doctor", "DOCTOR" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "78de89a7-1887-419f-ad4c-6e9b8f915cb1", "edb26c03-4b14-4413-b1db-5af93ab662c8", "Patient", "PATIENT" });
        }
    }
}
