using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfol.Api.Data;
using Portfol.Api.Models;

namespace Portfol.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BlogController(AppDbContext context)
        {
            _context = context;
        }

        // Public Route: Lista apenas os que NÃO são rascunho
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetBlogPosts()
        {
            return await _context.BlogPosts
                .Where(b => !b.IsDraft)
                .OrderByDescending(b => b.PublishedAt)
                .ToListAsync();
        }

        // Rota Admin: Lista TODOS para exibir na listagem do painel
        [HttpGet("admin")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BlogPost>>> GetAllForAdmin()
        {
            return await _context.BlogPosts
                .OrderByDescending(b => b.PublishedAt)
                .ToListAsync();
        }

        // Rota de Leitura do Post pelo Título em formato de URL (Slug)
        [HttpGet("{slug}")]
        public async Task<ActionResult<BlogPost>> GetBlogPostBySlug(string slug)
        {
            var post = await _context.BlogPosts.FirstOrDefaultAsync(b => b.Slug == slug);
            
            if (post == null)
            {
                return NotFound();
            }

            // Barra o leitor externo se tentou adivinhar o link de um rascunho (exceto o próprio admin)
            if (post.IsDraft && User?.Identity?.IsAuthenticated != true)
            {
                return NotFound();
            }

            return post;
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BlogPost>> CreateBlogPost(BlogPost post)
        {
            if (string.IsNullOrWhiteSpace(post.Slug))
            {
                post.Slug = GenerateSlug(post.Title);
            }

            post.PublishedAt = post.PublishedAt.ToUniversalTime();

            _context.BlogPosts.Add(post);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlogPostBySlug), new { slug = post.Slug }, post);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateBlogPost(int id, BlogPost post)
        {
            if (id != post.Id) return BadRequest();

            if (string.IsNullOrWhiteSpace(post.Slug))
            {
                post.Slug = GenerateSlug(post.Title);
            }

            post.PublishedAt = post.PublishedAt.ToUniversalTime();

            _context.Entry(post).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteBlogPost(int id)
        {
            var post = await _context.BlogPosts.FindAsync(id);
            if (post == null) return NotFound();

            _context.BlogPosts.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string GenerateSlug(string title)
        {
            if (string.IsNullOrEmpty(title)) return "post-" + Guid.NewGuid().ToString().Substring(0, 5);
            var slug = title.ToLower();
            // Limpeza báscia de URL
            slug = slug.Replace(" ", "-").Replace("?", "").Replace("!", "").Replace(".", "").Replace(",", "").Replace("é", "e").Replace("á", "a").Replace("ó", "o").Replace("ã", "a").Replace("ç", "c");
            return slug;
        }
    }
}
