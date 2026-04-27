using Portfol.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Portfol.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    // Isso diz ao EF Core para criar uma tabela chamada "Projects"
    public DbSet<Project> Projects { get; set; } = null!;

    // Tabela do Novo Blog
    public DbSet<BlogPost> BlogPosts { get; set; } = null!;

    // Novas Entidades
    public DbSet<Resume> Resumes { get; set; } = null!;
    public DbSet<Certificate> Certificates { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.ConfigureWarnings(warnings => warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
        base.OnConfiguring(optionsBuilder);
    }

    // Vamos inserir alguns dados falsos (Seed) para você já ter o que mostrar no Front
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Project>().HasData(
            new Project
            {
                Id = 1,
                Title = "TwilCollector",
                Category = "Backend & Ferramentas",
                ShortDescription = "Ferramenta para debug e análise de logs de chatbots.",
                FullDescription = "Desenvolvido para otimizar o fluxo de monitoramento de dados em sistemas de mensageria...",
                Techs = ["Python", "PHP", "Laravel"],
                ColorClass = "text-blue-400",
                BgBorderClass = "border-blue-500/30"
            },
            new Project
            {
                Id = 2,
                Title = "Ubiqua Universe!",
                Category = "Game Development",
                ShortDescription = "Plataforma de gamificação mobile imersiva.",
                FullDescription = "Focada em engajamento e experiência do usuário em ambientes educacionais, utilizando mecânicas de jogos para retenção de conhecimento.",
                Techs = ["Unity", "C#", "Mobile UI"],
                ColorClass = "text-purple-400",
                BgBorderClass = "border-purple-500/30"
            }
        );
    }
}