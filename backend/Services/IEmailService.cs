namespace Portfol.Api.Services
{
    public interface IEmailService
    {
        Task SendEmailAsync(string fromName, string fromEmail, string message);
    }
}
