namespace Portfol.Api.Models;

public class Resume
{
    public int Id { get; set; }
    public string Language { get; set; } = "PT"; // PT ou EN
    public string FileUrl { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
