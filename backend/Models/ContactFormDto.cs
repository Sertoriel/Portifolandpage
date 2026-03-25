using System.ComponentModel.DataAnnotations;

namespace Portfol.Api.Models
{
    public class ContactFormDto
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "O e-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "O e-mail informado é inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "A mensagem é obrigatória.")]
        public string Message { get; set; } = string.Empty;
    }
}
