using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class modify_applicationuser_1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5989788f-d6f0-4e59-8062-6b5d9d207c51");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "ca3a2156-a7f0-45ba-a0fb-035b55251d73");

            migrationBuilder.DropColumn(
                name: "IsAutoAcceptAppointment",
                table: "AspNetUsers");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "75b661de-fdd6-4150-84d3-33b15849e037", "cb552c18-2d10-49cb-a495-2cbe1140ab79", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b6a7d92a-ec68-4632-845b-6c4bfedc5a2b", "97faf78b-a83c-4093-bb98-f70e4265ce14", "User", "USER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "75b661de-fdd6-4150-84d3-33b15849e037");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b6a7d92a-ec68-4632-845b-6c4bfedc5a2b");

            migrationBuilder.AddColumn<bool>(
                name: "IsAutoAcceptAppointment",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "ca3a2156-a7f0-45ba-a0fb-035b55251d73", "0ee06b31-f4cb-433f-aae6-d6cc8b4cba6d", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "5989788f-d6f0-4e59-8062-6b5d9d207c51", "681e3171-36fa-473a-9818-4f61131cfcf2", "User", "USER" });
        }
    }
}
