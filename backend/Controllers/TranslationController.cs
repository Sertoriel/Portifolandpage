using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;

namespace Portfol.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslationController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public TranslationController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient();
        }

        public class TranslationRequest
        {
            public string Text { get; set; } = string.Empty;
        }

        [HttpPost]
        [Authorize] // Apenas o administrador logado pode realizar custos/requisições de tradução
        public async Task<IActionResult> Translate([FromBody] TranslationRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Text))
                return Ok(new { translatedText = "" });

            try
            {
                // Unofficial Google Translate API Frontend Endpoint
                var url = $"https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=en&dt=t&q={Uri.EscapeDataString(request.Text)}";

                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                using var document = JsonDocument.Parse(json);
                var root = document.RootElement;
                
                var translatedBuilder = new StringBuilder();
                if (root.ValueKind == JsonValueKind.Array && root.GetArrayLength() > 0)
                {
                    var blocks = root[0];
                    foreach (var block in blocks.EnumerateArray())
                    {
                        if (block.ValueKind == JsonValueKind.Array && block.GetArrayLength() > 0)
                        {
                            translatedBuilder.Append(block[0].GetString());
                        }
                    }
                }

                return Ok(new { translatedText = translatedBuilder.ToString() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Erro ao traduzir na IA: " + ex.Message });
            }
        }
    }
}
