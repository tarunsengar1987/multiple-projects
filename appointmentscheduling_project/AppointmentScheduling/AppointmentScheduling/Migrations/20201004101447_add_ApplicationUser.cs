using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class add_ApplicationUser : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b7e37cdc-fbe9-4277-8cc9-9150d7323b86");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ed24628c-138d-42e2-b397-6717ad253aa1");

            migrationBuilder.AddColumn<bool>(
                name: "IsAutoAcceptAppointment",
                table: "AspNetUsers",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "14600124-0a19-47b2-835d-ff437890a02c", "02929cde-246e-4afa-bd3f-0be0e6ba5478", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "dd2d9ed2-e432-4487-a2a6-0341d8932b20", "4a0cdff0-3af0-4c67-9d79-87a9185fe7f2", "User", "USER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "14600124-0a19-47b2-835d-ff437890a02c");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dd2d9ed2-e432-4487-a2a6-0341d8932b20");

            migrationBuilder.DropColumn(
                name: "IsAutoAcceptAppointment",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "Name",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b7e37cdc-fbe9-4277-8cc9-9150d7323b86", "8f04a51d-b53a-4bac-8dba-a1a5bab5529a", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "ed24628c-138d-42e2-b397-6717ad253aa1", "2429bf47-c526-407d-9fe6-d7e83b0125b6", "User", "USER" });
        }
    }
}
