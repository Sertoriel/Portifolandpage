using System;
using System.ComponentModel.DataAnnotations;

namespace Portfol.Api.Models
{
    public class BlogPost
    {
        public int Id { get; set; }
        
        [Required]
        public string Title { get; set; } = string.Empty;
        
        // A Slug é sua URL linda! Ex: /blog/o-dia-em-que-aprendi-csharp
        [Required]
        public string Slug { get; set; } = string.Empty;
        
        public string Summary { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
        
        public bool IsDraft { get; set; } = false;
    }
}
