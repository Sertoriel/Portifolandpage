using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace Portfol.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;
        private readonly HttpClient _httpClient; // Usando HttpClient em vez de SmtpClient

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger, HttpClient httpClient)
        {
            _configuration = configuration;
            _logger = logger;
            _httpClient = httpClient;
        }

        public async Task SendEmailAsync(string fromName, string fromEmail, string message)
        {
            try
            {
                var apiKey = _configuration["ResendApiKey"];
                // Fallback inteligente para o seu e-mail caso a variável não esteja setada
                var toEmail = _configuration["ContactEmail"] ?? "jotaduarfar@gmail.com";

                if (string.IsNullOrEmpty(apiKey))
                {
                    throw new InvalidOperationException("A chave da API (ResendApiKey) está ausente no ambiente.");
                }

                // Payload no formato exigido pela API do Resend
                var payload = new
                {
                    // O Resend exige que o envio seja feito pelo domínio de teste deles até você adicionar um domínio próprio
                    from = "Portfólio Contato <onboarding@resend.dev>",
                    to = new[] { toEmail },
                    reply_to = fromEmail,
                    subject = $"Novo Contato de: {fromName}",
                    html = $"<h3>Nova Mensagem Recebida via Site</h3><p><strong>Nome:</strong> {fromName}</p><p><strong>E-mail:</strong> {fromEmail}</p><hr/><p>{message}</p>"
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

                // Adicionando o Token de autenticação
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

                // Disparo pela porta HTTPS (443) - Imune a bloqueios de firewall do Render
                var response = await _httpClient.PostAsync("https://api.resend.com/emails", jsonContent);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    throw new HttpRequestException($"Falha da API Resend ({response.StatusCode}): {errorContent}");
                }

                _logger.LogInformation("E-mail enviado com sucesso via API.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail via formulário de contato.");
                throw;
            }
        }
    }
}