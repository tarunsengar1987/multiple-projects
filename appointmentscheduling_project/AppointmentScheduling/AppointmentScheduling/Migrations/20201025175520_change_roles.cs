using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class change_roles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "429702b7-e8db-4aef-b36b-31b88203f028");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fbf3eb79-1fce-46bf-aae5-1487e3158aa6");

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

        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "fbf3eb79-1fce-46bf-aae5-1487e3158aa6", "abcec8f6-3f0e-4de3-957e-10843fb6ec30", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "429702b7-e8db-4aef-b36b-31b88203f028", "86eb01f6-bad9-4ed7-8aa4-b3ab1cebdd8e", "User", "USER" });
        }
    }
}
