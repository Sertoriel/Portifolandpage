using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace Portfol.Api.Services
{
    public class ImageUploadService : IImageUploadService
    {
        private readonly Cloudinary _cloudinary;

        public ImageUploadService(IConfiguration config)
        {
            var account = new Account(
                config["Cloudinary:CloudName"],
                config["Cloudinary:ApiKey"],
                config["Cloudinary:ApiSecret"]
            );
            
            _cloudinary = new Cloudinary(account);
            _cloudinary.Api.Secure = true;
        }

        public async Task<string> UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return string.Empty;

            using var stream = file.OpenReadStream();
            
            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                // Vamos poupar banda da sua página! FetchFormat = "webp" geralmente e quality auto (diminui tamanho pra carregar rapido)
                Transformation = new Transformation().Quality("auto").FetchFormat("auto")
            };

            var uploadResult = await _cloudinary.UploadAsync(uploadParams);
            
            if (uploadResult.Error != null)
            {
                // Se cairmos em erro de permissão ou falha sistêmica 
                throw new InvalidOperationException($"Cloudinary failure: {uploadResult.Error.Message}");
            }

            // Ele devolve a "https://res...." pronta para uso
            return uploadResult.SecureUrl.ToString();
        }
    }
}
