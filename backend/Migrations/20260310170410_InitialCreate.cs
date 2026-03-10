using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Portfol.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    ShortDescription = table.Column<string>(type: "TEXT", nullable: false),
                    FullDescription = table.Column<string>(type: "TEXT", nullable: false),
                    Techs = table.Column<string>(type: "TEXT", nullable: false),
                    ThumbnailUrl = table.Column<string>(type: "TEXT", nullable: false),
                    GithubLink = table.Column<string>(type: "TEXT", nullable: true),
                    DownloadLink = table.Column<string>(type: "TEXT", nullable: true),
                    ColorClass = table.Column<string>(type: "TEXT", nullable: false),
                    BgBorderClass = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "Id", "BgBorderClass", "Category", "ColorClass", "DownloadLink", "FullDescription", "GithubLink", "ShortDescription", "Techs", "ThumbnailUrl", "Title" },
                values: new object[,]
                {
                    { 1, "border-blue-500/30", "Backend & Ferramentas", "text-blue-400", null, "Desenvolvido para otimizar o fluxo de monitoramento de dados em sistemas de mensageria...", null, "Ferramenta para debug e análise de logs de chatbots.", "[\"Python\",\"PHP\",\"Laravel\"]", "", "TwilCollector" },
                    { 2, "border-purple-500/30", "Game Development", "text-purple-400", null, "Focada em engajamento e experiência do usuário em ambientes educacionais, utilizando mecânicas de jogos para retenção de conhecimento.", null, "Plataforma de gamificação mobile imersiva.", "[\"Unity\",\"C#\",\"Mobile UI\"]", "", "Ubiqua Universe!" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");
        }
    }
}
