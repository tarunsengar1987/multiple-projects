using Microsoft.EntityFrameworkCore.Migrations;

namespace AppointmentScheduling.Migrations
{
    public partial class settingupdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            //migrationBuilder.DeleteData(
            //    table: "AspNetRoles",
            //    keyColumn: "Id",
            //    keyValue: "75b661de-fdd6-4150-84d3-33b15849e037");

            //migrationBuilder.DeleteData(
            //    table: "AspNetRoles",
            //    keyColumn: "Id",
            //    keyValue: "b6a7d92a-ec68-4632-845b-6c4bfedc5a2b");

            migrationBuilder.AddColumn<bool>(
                name: "SendEmailNotification",
                table: "Settings",
                nullable: false,
                defaultValue: false);

            //migrationBuilder.InsertData(
            //    table: "AspNetRoles",
            //    columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
            //    values: new object[] { "fbf3eb79-1fce-46bf-aae5-1487e3158aa6", "abcec8f6-3f0e-4de3-957e-10843fb6ec30", "Admin", "ADMIN" });

            //migrationBuilder.InsertData(
            //    table: "AspNetRoles",
            //    columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
            //    values: new object[] { "429702b7-e8db-4aef-b36b-31b88203f028", "86eb01f6-bad9-4ed7-8aa4-b3ab1cebdd8e", "User", "USER" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "429702b7-e8db-4aef-b36b-31b88203f028");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "fbf3eb79-1fce-46bf-aae5-1487e3158aa6");

            migrationBuilder.DropColumn(
                name: "SendEmailNotification",
                table: "Settings");

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "75b661de-fdd6-4150-84d3-33b15849e037", "cb552c18-2d10-49cb-a495-2cbe1140ab79", "Admin", "ADMIN" });

            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[] { "b6a7d92a-ec68-4632-845b-6c4bfedc5a2b", "97faf78b-a83c-4093-bb98-f70e4265ce14", "User", "USER" });
        }
    }
}
