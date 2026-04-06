using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;

namespace Portfol.Api.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string fromName, string fromEmail, string message)
        {
            try
            {
                var smtpHost = _configuration["SmtpHost"];
                var smtpPortString = _configuration["SmtpPort"];
                var smtpUser = _configuration["SmtpUser"];
                var smtpPass = _configuration["SmtpPass"];

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpPortString) ||
                    string.IsNullOrEmpty(smtpUser) || string.IsNullOrEmpty(smtpPass))
                {
                    throw new InvalidOperationException("Configurações SMTP ausentes no ambiente.");
                }

                if (!int.TryParse(smtpPortString, out int smtpPort))
                {
                    smtpPort = 587; // Porta padrão de fallback
                }

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("Formulário de Contato", smtpUser));
                emailMessage.To.Add(new MailboxAddress("Admin", smtpUser));
                emailMessage.ReplyTo.Add(new MailboxAddress(fromName, fromEmail));

                emailMessage.Subject = $"Novo Contato de: {fromName}";
                emailMessage.Body = new TextPart(TextFormat.Html)
                {
                    Text = $"<h3>Nova Mensagem Recebida via Site</h3><p><strong>Nome:</strong> {fromName}</p><p><strong>E-mail:</strong> {fromEmail}</p><hr/><p>{message}</p>"
                };

                using var client = new SmtpClient();

                // Aumentado para 30 segundos (30000ms) para contornar a lentidão do Render
                client.Timeout = 30000;

                // Configuração dinâmica de segurança: SSL para porta 465, StartTls para porta 587
                var options = smtpPort == 465 ? SecureSocketOptions.SslOnConnect : SecureSocketOptions.StartTls;

                await client.ConnectAsync(smtpHost, smtpPort, options);
                await client.AuthenticateAsync(smtpUser, smtpPass);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);

                _logger.LogInformation("E-mail enviado com sucesso.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao enviar e-mail via formulário de contato.");
                throw;
            }
        }
    }
}