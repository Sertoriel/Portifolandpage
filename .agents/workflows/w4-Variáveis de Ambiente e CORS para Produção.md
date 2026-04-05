---
description: Refatoração de Variáveis de Ambiente e CORS para Produção
---

Objetivo: Remover URLs fixas (hardcoded) do Frontend e do Backend para permitir a transição dinâmica entre o ambiente local (localhost) e a nuvem (Render/Vercel).

Passos para o Agente Executar:
1. No diretório `.\frontend`, crie um arquivo `.env` na raiz contendo: `VITE_API_URL=http://localhost:5000/api`
2. Varra os componentes React (`FeatureSection.jsx`, `Login.jsx`, `AdminDashboard.jsx`, etc.) e substitua qualquer menção estática a `http://localhost:5000/api` pela chamada dinâmica `import.meta.env.VITE_API_URL`. Ex: `fetch(`${import.meta.env.VITE_API_URL}/Projects`)`.
3. Navegue para o diretório `.\backend`.
4. No arquivo `appsettings.json`, adicione uma nova chave na raiz: `"FrontendUrl": "http://localhost:5173"`.
5. Modifique a política de CORS no arquivo `Program.cs`. Em vez de fixar `http://localhost:5173`, faça o `.WithOrigins()` ler dinamicamente o array de URLs vindo de `builder.Configuration.GetSection("FrontendUrl").Get<string[]>()` ou diretamente de `builder.Configuration["FrontendUrl"]`. Caso seja nulo, use um wildcard restrito ou passe via variável de ambiente.
6. Revise os arquivos modificados e confirme ao usuário que as rotas estão parametrizadas e prontas para o CI/CD.