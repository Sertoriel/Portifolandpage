---
trigger: always_on
description: Padrões de integração para novas features
---

1. **E-mails (MailKit):** Nunca hardcode credenciais SMTP. Sempre leia de `IConfiguration`. Crie um DTO específico (`ContactFormDto`) para receber os dados do React. Trate exceções de timeout.
2. **Uploads (Imagens):** O painel de Admin usa URLs em texto atualmente. Ao integrar um serviço de nuvem (ex: Cloudinary), o backend deve receber um `IFormFile`, processar o upload assíncrono, e devolver a string da URL gerada para ser salva no banco pelo EF Core.
3. **Tratamento de Erro Global:** Se uma integração externa falhar, retorne um `ObjectResult` HTTP 500 ou 503 padronizado em JSON. O React deve capturar esse status e renderizar um *toast* ou a animação Lottie de erro.