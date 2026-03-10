namespace Portfol.Api.Models;

public class Project
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    
    // Descrição curta para o carrossel da Landing Page
    public string ShortDescription { get; set; } = string.Empty;
    
    // Descrição completa para a página de Detalhes
    public string FullDescription { get; set; } = string.Empty;
    
    // Lista de tecnologias (O EF Core converte isso nativamente para JSON no banco)
    public List<string> Techs { get; set; } = new();
    
    // URLs para imagens e links
    public string ThumbnailUrl { get; set; } = string.Empty;
    public string? GithubLink { get; set; } // O '?' indica que é opcional
    public string? DownloadLink { get; set; }
    
    // Cores para o frontend (Opcional, mas mantém o design dinâmico)
    public string ColorClass { get; set; } = "text-blue-400";
    public string BgBorderClass { get; set; } = "border-blue-500/30";
}