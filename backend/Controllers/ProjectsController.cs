using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Portfol.Api.Data;
using Portfol.Api.Models;
using Portfol.Api.Services;

namespace Portfol.Api.Controllers;

// Estas marcações dizem ao .NET que esta classe é um ponto de acesso da API
[ApiController]
[Route("api/[controller]")] // A URL final será "api/projects" (o nome da classe sem o sufixo 'Controller')
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IImageUploadService _imageUploadService;

    // Injeção de Dependência: O .NET entrega o banco de dados e serviços prontos
    public ProjectsController(AppDbContext context, IImageUploadService imageUploadService)
    {
        _context = context;
        _imageUploadService = imageUploadService;
    }

    // GET: api/projects
    // Rota que o FeatureSection.jsx do React vai chamar para montar o carrossel
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
    {
        // Vai no banco (SQLite), pega todos os projetos e devolve
        var projects = await _context.Projects.ToListAsync();
        return Ok(projects);
    }

    // GET: api/projects/1
    // Rota que o ProjectDetails.jsx do React vai chamar quando você clicar em um projeto específico
    [HttpGet("{id}")]
    public async Task<ActionResult<Project>> GetProject(int id)
    {
        // Busca o projeto pelo ID
        var project = await _context.Projects.FindAsync(id);

        // Se o cara tentar acessar um ID que não existe (ex: /projeto/99), devolvemos o erro 404
        if (project == null)
        {
            return NotFound(new { message = "Projeto não encontrado no universo." });
        }

        return Ok(project);
    }

    // POST: api/projects
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Project>> CreateProject([FromForm] ProjectUploadDto dto)
    {
        // 1. Verificação Híbrida (Se não mandou arquivo físico, usa o texto puro do ThumbnailUrl)
        string finalUrl = dto.ThumbnailUrl ?? string.Empty;

        // Se fez upload com pacote de byte válido
        if (dto.Image != null && dto.Image.Length > 0)
        {
            finalUrl = await _imageUploadService.UploadImageAsync(dto.Image);
        }

        // 2. Mapeamento do DTO para a Entidade de Banco EF Core
        var project = new Project
        {
            Title = dto.Title,
            Category = dto.Category,
            ShortDescription = dto.ShortDescription,
            FullDescription = dto.FullDescription,
            TitleEn = dto.TitleEn,
            CategoryEn = dto.CategoryEn,
            ShortDescriptionEn = dto.ShortDescriptionEn,
            FullDescriptionEn = dto.FullDescriptionEn,
            ThumbnailUrl = finalUrl,
            GithubLink = dto.GithubLink,
            DownloadLink = dto.DownloadLink,
            ColorClass = dto.ColorClass,
            BgBorderClass = dto.BgBorderClass,
            Techs = !string.IsNullOrWhiteSpace(dto.Techs) 
                ? dto.Techs.Split(',').Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)).ToList() 
                : new List<string>()
        };

        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateProject(int id, [FromForm] ProjectUploadDto dto)
    {
        if (id != dto.Id)
        {
            return BadRequest(new { message = "O ID da URL não bate com o do projeto." });
        }

        var existingProject = await _context.Projects.FindAsync(id);
        if (existingProject == null)
            return NotFound();

        // Verificação Híbrida de Atualização
        if (dto.Image != null && dto.Image.Length > 0)
        {
            // O usuário fez upload de uma FOTO NOVA da própria máquina. Ignore qualquer string antiga e envie para o Cloudinary.
            existingProject.ThumbnailUrl = await _imageUploadService.UploadImageAsync(dto.Image);
        }
        else if (dto.ThumbnailUrl != existingProject.ThumbnailUrl)
        {
            // O usuário não upou foto binária, mas alterou (ou colou) o link manualmente de uma já existente.
            existingProject.ThumbnailUrl = dto.ThumbnailUrl ?? string.Empty;
        }

        // Alterações básicas textuais
        existingProject.Title = dto.Title;
        existingProject.Category = dto.Category;
        existingProject.ShortDescription = dto.ShortDescription;
        existingProject.FullDescription = dto.FullDescription;

        // Alterações de Traduções em Inglês
        existingProject.TitleEn = dto.TitleEn;
        existingProject.CategoryEn = dto.CategoryEn;
        existingProject.ShortDescriptionEn = dto.ShortDescriptionEn;
        existingProject.FullDescriptionEn = dto.FullDescriptionEn;

        existingProject.GithubLink = dto.GithubLink;
        existingProject.DownloadLink = dto.DownloadLink;

        if (!string.IsNullOrWhiteSpace(dto.Techs))
        {
            existingProject.Techs = dto.Techs.Split(',').Select(t => t.Trim()).Where(t => !string.IsNullOrEmpty(t)).ToList();
        }
        else
        {
             existingProject.Techs = new List<string>();
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Projects.Any(e => e.Id == id))
                return NotFound();
            else
                throw;
        }

        return NoContent(); 
    }

    // DELETE: api/projects/5
    // Apaga um projeto do banco de dados
    [HttpDelete("{id}")]
    [Authorize] // Protegido pela pulseira VIP!
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        
        if (project == null)
        {
            return NotFound();
        }

        // Remove do banco e salva
        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent(); // 204 No Content
    }

}