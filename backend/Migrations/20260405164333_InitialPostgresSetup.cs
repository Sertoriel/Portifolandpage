using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Portfol.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialPostgresSetup : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BlogPosts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    Summary = table.Column<string>(type: "text", nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    TitleEn = table.Column<string>(type: "text", nullable: true),
                    SummaryEn = table.Column<string>(type: "text", nullable: true),
                    ContentEn = table.Column<string>(type: "text", nullable: true),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsDraft = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlogPosts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    ShortDescription = table.Column<string>(type: "text", nullable: false),
                    FullDescription = table.Column<string>(type: "text", nullable: false),
                    TitleEn = table.Column<string>(type: "text", nullable: true),
                    CategoryEn = table.Column<string>(type: "text", nullable: true),
                    ShortDescriptionEn = table.Column<string>(type: "text", nullable: true),
                    FullDescriptionEn = table.Column<string>(type: "text", nullable: true),
                    Techs = table.Column<List<string>>(type: "text[]", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "text", nullable: false),
                    GithubLink = table.Column<string>(type: "text", nullable: true),
                    DownloadLink = table.Column<string>(type: "text", nullable: true),
                    ColorClass = table.Column<string>(type: "text", nullable: false),
                    BgBorderClass = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "BgBorderClass", "Category", "CategoryEn", "ColorClass", "DownloadLink", "FullDescription", "FullDescriptionEn", "GithubLink", "ShortDescription", "ShortDescriptionEn", "Techs", "ThumbnailUrl", "Title", "TitleEn" },
                values: new object[,]
                {
                    { 1, "border-blue-500/30", "Backend & Ferramentas", null, "text-blue-400", null, "Desenvolvido para otimizar o fluxo de monitoramento de dados em sistemas de mensageria...", null, null, "Ferramenta para debug e análise de logs de chatbots.", null, new List<string> { "Python", "PHP", "Laravel" }, "", "TwilCollector", null },
                    { 2, "border-purple-500/30", "Game Development", null, "text-purple-400", null, "Focada em engajamento e experiência do usuário em ambientes educacionais, utilizando mecânicas de jogos para retenção de conhecimento.", null, null, "Plataforma de gamificação mobile imersiva.", null, new List<string> { "Unity", "C#", "Mobile UI" }, "", "Ubiqua Universe!", null }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BlogPosts");

            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
