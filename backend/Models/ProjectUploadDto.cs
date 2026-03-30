using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace Portfol.Api.Models
{
    public class ProjectUploadDto
    {
        public int Id { get; set; }
        
        [Required(ErrorMessage = "O título é obrigatório.")]
        public string Title { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "A categoria é obrigatória.")]
        public string Category { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "A descrição curta é obrigatória.")]
        public string ShortDescription { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "A descrição completa é obrigatória.")]
        public string FullDescription { get; set; } = string.Empty;
        
        // Techs agora chegam como string na Request Multipart DTO, em vez de um Array puro de JSON
        public string Techs { get; set; } = string.Empty;
        
        // Os campos do modelo híbrido de fotos
        public string? ThumbnailUrl { get; set; } // Valor inserido por colagem manual de internet ou o banco atual
        public IFormFile? Image { get; set; }     // Valor providenciado via clique no upload nativo do Browser

        public string? GithubLink { get; set; }
        public string? DownloadLink { get; set; }
        public string ColorClass { get; set; } = "text-blue-400";
        public string BgBorderClass { get; set; } = "border-blue-500/30";
    }
}
