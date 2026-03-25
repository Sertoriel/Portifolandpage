using Microsoft.AspNetCore.Mvc;
using Portfol.Api.Models;
using Portfol.Api.Services;

namespace Portfol.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;

        public ContactController(IEmailService emailService)
        {
            _emailService = emailService;
        }

        [HttpPost]
        public async Task<IActionResult> SubmitContact([FromBody] ContactFormDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                await _emailService.SendEmailAsync(dto.Name, dto.Email, dto.Message);
                return Ok(new { message = "E-mail enviado com sucesso." });
            }
            catch (TimeoutException ex)
            {
                // Regra 3 (Tratamento de timeout)
                return StatusCode(503, new { error = "Timeout ao tentar comunicar com o serviço SMTP.", details = ex.Message });
            }
            catch (Exception ex)
            {
                // Regra 3 (Erro 500 padronizado)
                return StatusCode(500, new { error = "Falha interna ao tentar enviar o e-mail.", details = ex.Message });
            }
        }
    }
}
