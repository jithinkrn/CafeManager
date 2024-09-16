using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace CafeManager.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Cafes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Logo = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Location = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cafes", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Employees",
                columns: table => new
                {
                    Id = table.Column<string>(type: "varchar(9)", maxLength: 9, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    EmailAddress = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PhoneNumber = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Gender = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CafeId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    StartDate = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Employees", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Employees_Cafes_CafeId",
                        column: x => x.CafeId,
                        principalTable: "Cafes",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Cafes",
                columns: new[] { "Id", "Description", "Location", "Logo", "Name" },
                values: new object[,]
                {
                    { new Guid("56eb7231-f7c3-47ed-aa2c-39998baa19b8"), "A cozy cafe serving artisanal coffee in the heart of Tanjong Pagar.", "Tanjong Pagar", "/uploads/sampleLogo/1_C_logo.jpg", "The Daily Grind" },
                    { new Guid("f55d1098-a532-4822-9f5c-0d6678e815fc"), "A modern cafe with a relaxing atmosphere, located in the bustling Orchard Road.", "Orchard Road", "/uploads/sampleLogo/2_B_logo.jpg", "Brew & Co." }
                });

            migrationBuilder.InsertData(
                table: "Employees",
                columns: new[] { "Id", "CafeId", "EmailAddress", "Gender", "Name", "PhoneNumber", "StartDate" },
                values: new object[,]
                {
                    { "UI1234567", new Guid("56eb7231-f7c3-47ed-aa2c-39998baa19b8"), "john.tan@dailygrind.com", "Male", "John Tan", "91234567", new DateTime(2022, 9, 15, 22, 15, 3, 690, DateTimeKind.Local).AddTicks(5977) },
                    { "UI2345678", new Guid("56eb7231-f7c3-47ed-aa2c-39998baa19b8"), "jane.lim@dailygrind.com", "Female", "Jane Lim", "81234567", new DateTime(2023, 9, 15, 22, 15, 3, 690, DateTimeKind.Local).AddTicks(5997) },
                    { "UI3456789", new Guid("f55d1098-a532-4822-9f5c-0d6678e815fc"), "alice.wong@brewco.com", "Female", "Alice Wong", "82234567", new DateTime(2024, 3, 15, 22, 15, 3, 690, DateTimeKind.Local).AddTicks(5999) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Employees_CafeId",
                table: "Employees",
                column: "CafeId");

            migrationBuilder.CreateIndex(
                name: "IX_Employees_Id",
                table: "Employees",
                column: "Id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Employees");

            migrationBuilder.DropTable(
                name: "Cafes");
        }
    }
}
