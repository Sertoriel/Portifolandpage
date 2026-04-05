---
description: Geração do Blueprint (render.yaml) para CI/CD Automatizado
---

Objetivo: Criar o arquivo de orquestração do Render (IaC) para provisionar simultaneamente um banco PostgreSQL e um Web Service em .NET 10, amarrando as variáveis de ambiente internamente.

Passos para o Agente Executar:
1. Na raiz do projeto (fora das pastas frontend/backend), crie um arquivo chamado `render.yaml`.
2. Estruture o YAML para declarar dois serviços: um `database` (PostgreSQL) e um `web` (ambiente Docker ou Native .NET).
3. Configurações obrigatórias para o `web` no render.yaml:
   - `env`: `docker` ou `dotnet` (se for nativo, buildCommand: `cd backend && dotnet build -c Release -o out`, startCommand: `cd backend && dotnet out/Portfol.Api.dll`).
   - `rootDir`: `backend`.
   - Adicione a variável de ambiente `ConnectionStrings__DefaultConnection` e faça o link dinâmico usando `fromDatabase: name_do_database` (sintaxe do Render para injetar a URL do Postgres interno automaticamente).
   - Adicione chaves de ambiente vazias ou com valor "placeholder" para `Jwt__Key`, `AdminLogin__Username` e `AdminLogin__Password` com a flag `sync: false` (pois o usuário preencherá isso no painel web por segurança).
4. Forneça instruções em texto (como um output do terminal) orientando o usuário a:
   A) Conectar o repositório na Vercel e mudar o "Root Directory" para `frontend`.
   B) Conectar o repositório no painel do Render (Blueprint section) e deixar o `render.yaml` fazer todo o trabalho pesado.