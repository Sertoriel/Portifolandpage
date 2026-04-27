using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfol.Api.Data;
using Portfol.Api.Models;
using Portfol.Api.Services;

namespace Portfol.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResumeController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IImageUploadService _uploadService;

    public ResumeController(AppDbContext context, IImageUploadService uploadService)
    {
        _context = context;
        _uploadService = uploadService;
    }

    // GET: api/Resume?lang=PT
    [HttpGet]
    public async Task<IActionResult> GetResume([FromQuery] string lang = "PT")
    {
        var resume = await _context.Resumes
            .Where(r => r.Language.ToUpper() == lang.ToUpper())
            .OrderByDescending(r => r.UpdatedAt)
            .FirstOrDefaultAsync();

        if (resume == null) return NotFound(new { message = $"No resume found for language: {lang}" });

        return Ok(resume);
    }

    // POST: api/Resume/upload
    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadResume([FromForm] IFormFile file, [FromForm] string language)
    {
        if (file == null || file.Length == 0) return BadRequest("No file uploaded.");
        if (string.IsNullOrEmpty(language)) return BadRequest("Language is required (PT or EN).");

        try
        {
            var fileUrl = await _uploadService.UploadDocumentAsync(file);

            // Tenta encontrar se já existe currículo nessa linguagem
            var existingResume = await _context.Resumes
                .FirstOrDefaultAsync(r => r.Language.ToUpper() == language.ToUpper());

            if (existingResume != null)
            {
                existingResume.FileUrl = fileUrl;
                existingResume.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                var newResume = new Resume
                {
                    Language = language.ToUpper(),
                    FileUrl = fileUrl,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Resumes.Add(newResume);
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Resume uploaded successfully", url = fileUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }
}
