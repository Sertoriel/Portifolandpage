namespace Portfol.Api.Models;

public class Certificate
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Platform { get; set; } = string.Empty; // Ex: Udemy, Alura, Coursera
    public string Category { get; set; } = string.Empty; // Ex: Backend, Frontend, Cloud
    public string FileUrl { get; set; } = string.Empty;  // PDF/Image via Cloudinary
    public DateTime? IssueDate { get; set; }
}
