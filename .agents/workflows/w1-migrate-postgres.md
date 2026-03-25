---
description: Migração de SQLite para PostgreSQL
---

Objetivo: Substituir o provedor de banco de dados do Entity Framework Core de SQLite para PostgreSQL, preparando a API para hospedagem em nuvem.

Passos para o Agente Executar:
1. Navegue até o diretório `.\backend`.
2. Remova o pacote do SQLite e instale o pacote do PostgreSQL executando:
   `dotnet remove package Microsoft.EntityFrameworkCore.Sqlite`
   `dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL`
3. Atualize o arquivo `appsettings.json` para incluir uma `DefaultConnection` no formato PostgreSQL (deixe a senha vazia ou use uma variável de ambiente fictícia para o usuário preencher depois via User Secrets).
4. Modifique o arquivo `Program.cs`: troque `UseSqlite()` por `UseNpgsql()`.
5. Exclua a pasta `Migrations` atual do backend (pois as migrações do SQLite são incompatíveis com o Postgres).
6. Acione a Skill `ef-manager` (usando o script PowerShell) com a action `add` e o nome `InitialPostgresSetup` para recriar o schema.
7. Informe ao usuário que a migração estrutural foi concluída e peça para ele rodar o script com a action `update` quando o banco Postgres local/nuvem estiver rodando.