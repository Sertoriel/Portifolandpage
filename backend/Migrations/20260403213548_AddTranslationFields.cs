using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfol.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTranslationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CategoryEn",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FullDescriptionEn",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShortDescriptionEn",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "Projects",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ContentEn",
                table: "BlogPosts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SummaryEn",
                table: "BlogPosts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TitleEn",
                table: "BlogPosts",
                type: "TEXT",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "CategoryEn", "FullDescriptionEn", "ShortDescriptionEn", "TitleEn" },
                values: new object[] { null, null, null, null });

            migrationBuilder.UpdateData(
                table: "Projects",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "CategoryEn", "FullDescriptionEn", "ShortDescriptionEn", "TitleEn" },
                values: new object[] { null, null, null, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryEn",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "FullDescriptionEn",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ShortDescriptionEn",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "Projects");

            migrationBuilder.DropColumn(
                name: "ContentEn",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "SummaryEn",
                table: "BlogPosts");

            migrationBuilder.DropColumn(
                name: "TitleEn",
                table: "BlogPosts");
        }
    }
}
