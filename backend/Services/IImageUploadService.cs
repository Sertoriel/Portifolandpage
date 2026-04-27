using Microsoft.AspNetCore.Http;

namespace Portfol.Api.Services
{
    public interface IImageUploadService
    {
        Task<string> UploadImageAsync(IFormFile file);
        Task<string> UploadDocumentAsync(IFormFile file);
    }
}
