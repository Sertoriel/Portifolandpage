---
description: Configuração de Upload de Imagens
---

Objetivo: Substituir a inserção manual de URLs de imagem no painel Admin por um sistema de upload de arquivos que envia a imagem para o backend e a hospeda em um serviço Cloud (ex: Cloudinary).

Passos para o Agente Executar:
1. **Backend:** Navegue para `.\backend`. Adicione o pacote oficial do provedor escolhido (ex: `CloudinaryDotNet`).
2. Crie a interface `IImageUploadService` e sua implementação. O serviço deve receber um `IFormFile` e retornar a URL pública em `string`.
3. Atualize o `ProjectsController`: Modifique o endpoint de criação/edição para aceitar `[FromForm]` ao invés de `[FromBody]`, lidando com os dados do projeto junto com a imagem (`IFormFile`).
4. Solicite ao usuário que configure as chaves da API de imagem usando a skill `win-secrets-manager` no PowerShell.
5. **Frontend:** Vá para `.\frontend`. Modifique o formulário no `AdminDashboard.jsx`. Troque o campo de texto `thumbnailUrl` por um `<input type="file" accept="image/*" />`.
6. Ajuste a função de *submit* do React para usar `FormData` ao invés de `JSON.stringify` no fetch, garantindo que o arquivo seja transmitido corretamente para o .NET.