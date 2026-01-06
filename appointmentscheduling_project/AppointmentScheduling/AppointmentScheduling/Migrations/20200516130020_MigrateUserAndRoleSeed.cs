using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class MigrateUserAndRoleSeed : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "dedcb760-bf0b-406a-a524-0a1fe4002fa9");

            migrationBuilder.DeleteData(
                table: "AspNetUserRoles",
                keyColumns: new[] { "UserId", "RoleId" },
                keyValues: new object[] { "f628bf95-ee06-4f62-b25d-bc108cf0ca8f", "9e1e529f-f95d-4ba7-b040-2cb76d5aaf99" });

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "9e1e529f-f95d-4ba7-b040-2cb76d5aaf99");

            migrationBuilder.DeleteData(
                table: "AspNetUsers",
                keyColumn: "Id",
                keyValue: "f628bf95-ee06-4f62-b25d-bc108cf0ca8f");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "de3ea85e-dc95-4d4d-9f77-9c05cfa3f64e", "9bfcf7e6-234b-43e2-8575-db89d371352e", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "641b5609-36d7-4957-9826-e97bab855818", "ed210b5b-c0ca-4a94-95c5-373962c86ecb", "Moderator", "MODERATOR" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "641b5609-36d7-4957-9826-e97bab855818");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "de3ea85e-dc95-4d4d-9f77-9c05cfa3f64e");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "9e1e529f-f95d-4ba7-b040-2cb76d5aaf99", "edf6f260-d534-4305-be7c-b762ee77ad6e", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "dedcb760-bf0b-406a-a524-0a1fe4002fa9", "309ea46d-acf3-46c5-99b3-9917d44bd5a9", "Moderator", "MODERATOR" });

            migrationBuilder.InsertData(
                table: "AspNetUsers",
                columns: new[] { "Id", "AccessFailedCount", "ConcurrencyStamp", "Email", "EmailConfirmed", "LockoutEnabled", "LockoutEnd", "NormalizedEmail", "NormalizedUserName", "PasswordHash", "PhoneNumber", "PhoneNumberConfirmed", "SecurityStamp", "TwoFactorEnabled", "UserName" },
                values: new object[] { "f628bf95-ee06-4f62-b25d-bc108cf0ca8f", 0, "d40bd406-56ff-41aa-8edc-357979d3638f", "admin@gmail.com", false, false, null, "ADMIN@GMAIL.COM", "ADMIN@GMAIL.COM", "AQAAAAEAACcQAAAAEBcaTglOWSEu2Z3KKPcMPAqY/j+JbbIy9UTcs8KLVUKqIv5LP7NULt3XgbKj1lFgbA==", null, false, "926ee2ed-bddb-4df6-8e66-128017a07f89", false, "admin@gmail.com" });

            migrationBuilder.InsertData(
                table: "AspNetUserRoles",
                columns: new[] { "UserId", "RoleId" },
                values: new object[] { "f628bf95-ee06-4f62-b25d-bc108cf0ca8f", "9e1e529f-f95d-4ba7-b040-2cb76d5aaf99" });
        }
    }
}
