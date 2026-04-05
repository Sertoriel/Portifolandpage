---
description: Migração de SQLite para PostgreSQL com Ambiente Docker local
---

Objetivo: Substituir o provedor de banco de dados do Entity Framework Core de SQLite para PostgreSQL, gerando a infraestrutura Docker para testes locais, preparando a API para hospedagem em nuvem.

Passos para o Agente Executar:
1. Navegue até o diretório `.\backend`.
2. Remova o pacote do SQLite e instale o pacote do PostgreSQL executando:
   `dotnet remove package Microsoft.EntityFrameworkCore.Sqlite`
   `dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL`
3. Atualize o arquivo `appsettings.json` para incluir a `DefaultConnection` no formato PostgreSQL local padrão para o Docker: 
   "Host=localhost;Port=5432;Database=portfolio_db;Username=postgres;Password=postgres".
4. Modifique o arquivo `Program.cs`: troque a chamada `UseSqlite()` por `UseNpgsql()`.
5. Exclua a pasta `Migrations` atual do backend e apague o arquivo local `portfolio.db` (e seus temporários `-shm`, `-wal`, se existirem) para evitar conflitos de cache.
6. Crie um arquivo `docker-compose.yml` na raiz do diretório `.\backend` configurado com a imagem oficial do `postgres:latest`, mapeando a porta 5432, definindo variáveis de ambiente (POSTGRES_USER=postgres, POSTGRES_PASSWORD=postgres, POSTGRES_DB=portfolio_db) e criando um volume para persistência de dados.
7. Acione a Skill `ef-manager` (usando o script PowerShell) com a action `add` e o nome `InitialPostgresSetup` para recriar o schema e os snapshots estruturais em C#.
8. Informe ao usuário que a migração estrutural e o arquivo compose foram criados. Peça para o usuário rodar `docker compose up -d` no terminal e, logo em seguida, rodar a action `update` do `ef-manager` para construir as tabelas no novo banco.