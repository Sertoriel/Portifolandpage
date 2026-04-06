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
                    smtpPort = 465;
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
                client.Timeout = 30000; // Timeout de 30 segundos
                await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
                await client.AuthenticateAsync(smtpUser, smtpPass);
                await client.SendAsync(emailMessage);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro interno durante o envio de e-mail.");
                throw;
            }
        }
    }
}
