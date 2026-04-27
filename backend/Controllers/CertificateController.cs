using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfol.Api.Data;
using Portfol.Api.Models;
using Portfol.Api.Services;

namespace Portfol.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CertificateController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IImageUploadService _uploadService;

    public CertificateController(AppDbContext context, IImageUploadService uploadService)
    {
        _context = context;
        _uploadService = uploadService;
    }

    // GET: api/Certificate
    [HttpGet]
    public async Task<IActionResult> GetAllCertificates()
    {
        var certs = await _context.Certificates
            .OrderByDescending(c => c.IssueDate)
            .ToListAsync();
        return Ok(certs);
    }

    // POST: api/Certificate
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateCertificate([FromForm] string title, [FromForm] string platform, [FromForm] string category, [FromForm] string issueDate, [FromForm] IFormFile? file)
    {
        try
        {
            string fileUrl = string.Empty;

            if (file != null && file.Length > 0)
            {
                // Verifica se é imagem ou PDF pra enviar na rota certa do Cloudinary
                if (file.ContentType.Contains("pdf"))
                {
                    fileUrl = await _uploadService.UploadDocumentAsync(file);
                }
                else
                {
                    fileUrl = await _uploadService.UploadImageAsync(file);
                }
            }

            DateTime? parsedDate = null;
            if (DateTime.TryParse(issueDate, out DateTime d))
            {
                parsedDate = d.ToUniversalTime();
            }

            var cert = new Certificate
            {
                Title = title,
                Platform = platform,
                Category = category,
                FileUrl = fileUrl,
                IssueDate = parsedDate
            };

            _context.Certificates.Add(cert);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllCertificates), new { id = cert.Id }, cert);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Error creating certificate: {ex.Message}");
        }
    }

    // DELETE: api/Certificate/5
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCertificate(int id)
    {
        var cert = await _context.Certificates.FindAsync(id);
        if (cert == null) return NotFound();

        _context.Certificates.Remove(cert);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
