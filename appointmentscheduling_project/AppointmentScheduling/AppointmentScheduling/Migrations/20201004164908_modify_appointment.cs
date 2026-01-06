using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class modify_appointment : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "14600124-0a19-47b2-835d-ff437890a02c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dd2d9ed2-e432-4487-a2a6-0341d8932b20");

            migrationBuilder.AddColumn<string>(
                name: "ClientId",
                table: "Appointments",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "95e4b0ff-1b23-476d-a071-ffae61d0bb5e", "79e02d4a-475f-4efb-9ac1-0d063b53d3a0", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "bc589190-2c1d-4473-953a-349ced740653", "b3d05b66-9a89-453d-9534-4e24d0765949", "User", "USER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "95e4b0ff-1b23-476d-a071-ffae61d0bb5e");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "bc589190-2c1d-4473-953a-349ced740653");

            migrationBuilder.DropColumn(
                name: "ClientId",
                table: "Appointments");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "14600124-0a19-47b2-835d-ff437890a02c", "02929cde-246e-4afa-bd3f-0be0e6ba5478", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "dd2d9ed2-e432-4487-a2a6-0341d8932b20", "4a0cdff0-3af0-4c67-9d79-87a9185fe7f2", "User", "USER" });
        }
    }
}
