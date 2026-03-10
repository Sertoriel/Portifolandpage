using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Portfol.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _configuration;

    public AuthController(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // Classe simples para receber os dados do React
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {

        var expectedUser = _configuration["AdminLogin:Username"];
        var expectedPass = _configuration["AdminLogin:Password"];


        // 1. Verifica se é você mesmo (Troque por algo seguro!)
        if (request.Username == expectedUser && request.Password == expectedPass)
        {
            // 2. Monta a pulseira VIP (Token)
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, request.Username) }),
                Expires = DateTime.UtcNow.AddHours(2), // Validade de 2 horas
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtString = tokenHandler.WriteToken(token);

            // 3. Entrega a pulseira para o React
            return Ok(new { Token = jwtString });
        }

        // Se errar a senha, o segurança barra
        return Unauthorized(new { message = "Usuário ou senha inválidos." });
    }
}