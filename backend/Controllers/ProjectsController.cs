using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Portfol.Api.Data;
using Portfol.Api.Models;

namespace Portfol.Api.Controllers;

// Estas marcações dizem ao .NET que esta classe é um ponto de acesso da API
[ApiController]
[Route("api/[controller]")] // A URL final será "api/projects" (o nome da classe sem o sufixo 'Controller')
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;

    // Injeção de Dependência: O .NET entrega o banco de dados pronto para usarmos aqui
    public ProjectsController(AppDbContext context)
    {
        _context = context;
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
    // Rota que o React vai chamar para cadastrar um projeto novo
    [HttpPost]
    [Authorize]
    public async Task<ActionResult<Project>> CreateProject(Project project)
    {
        // 1. O EF Core pega o projeto que veio do React e prepara para salvar
        _context.Projects.Add(project);
        
        // 2. Salva de fato no banco de dados SQLite
        await _context.SaveChangesAsync();

        // 3. Retorna o status 201 (Created) e avisa qual ID o banco gerou para esse novo projeto
        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    [HttpPut("{id}")]
    [Authorize] // Protegido pela pulseira VIP!
    public async Task<IActionResult> UpdateProject(int id, Project project)
    {
        // Trava de segurança: O ID da URL tem que bater com o ID do corpo da requisição
        if (id != project.Id)
        {
            return BadRequest(new { message = "O ID da URL não bate com o do projeto." });
        }

        // Avisa o Entity Framework que esse projeto foi modificado e precisa ser salvo
        _context.Entry(project).State = EntityState.Modified;

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

        return NoContent(); // 204 No Content: Deu certo e não tem dados novos para devolver
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