---
trigger: always_on
description: Regras para proteger a API atual em .NET Core
---

Documentação Oficial Obrigatória
Consulte estas fontes antes de gerar qualquer código ou sugerir dependências:
- Geral .NET: https://learn.microsoft.com/pt-br/dotnet/
- EF Core: https://learn.microsoft.com/pt-br/ef/core/
- Web APIs ASP.NET Core: https://learn.microsoft.com/pt-br/aspnet/core/web-api/
- Autenticação JWT: https://learn.microsoft.com/pt-br/aspnet/core/security/authentication/jwt-authn
- App Secrets (User Secrets): https://learn.microsoft.com/pt-br/aspnet/core/security/app-secrets
- Scalar (Documentação API): https://github.com/scalar/scalar

Regras
1. **Intocabilidade do Core:** Não modifique a lógica do `AuthController` (JWT) ou o CRUD base do `ProjectsController` ao adicionar novas integrações, a menos que explicitamente solicitado.
2. **Entity Framework:** Isole a string de conexão em `appsettings.json`. O projeto iniciou com SQLite, mas está preparado para PostgreSQL. Não perca a configuração de *User Secrets* já estabelecida para produção.
3. **Injeção de Dependência:** Qualquer novo serviço deve ser injetado via `Program.cs` usando o padrão Scoped ou Transient.