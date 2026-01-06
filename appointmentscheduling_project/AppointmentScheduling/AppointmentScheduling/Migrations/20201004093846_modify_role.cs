using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class modify_role : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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
                values: new object[] { "b7e37cdc-fbe9-4277-8cc9-9150d7323b86", "8f04a51d-b53a-4bac-8dba-a1a5bab5529a", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "ed24628c-138d-42e2-b397-6717ad253aa1", "2429bf47-c526-407d-9fe6-d7e83b0125b6", "User", "USER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b7e37cdc-fbe9-4277-8cc9-9150d7323b86");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ed24628c-138d-42e2-b397-6717ad253aa1");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "de3ea85e-dc95-4d4d-9f77-9c05cfa3f64e", "9bfcf7e6-234b-43e2-8575-db89d371352e", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "641b5609-36d7-4957-9826-e97bab855818", "ed210b5b-c0ca-4a94-95c5-373962c86ecb", "Moderator", "MODERATOR" });
        }
    }
}
