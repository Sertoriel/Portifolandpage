# ⚙️ 3. Arquitetura Backend e Banco de Dados

Nos bastidores impenetráveis da aplicação reside a nossa Máquina Principal. Utilizando **.NET 10 (C#)** fundido com a robustez e performance bruta do Engine **PostgreSQL** montado em containers Docker.

## 3.1 Segurança via User Secrets (DotNet)
Jamais colocamos *Hardcoded Keys* em nossas classes dinâmicas, nem dependemos de subir arquivos `.env` cruciais que podem acidentalmente passar por desatenções de comitês `.gitignore`. 

O Backend isola **Strings de Conexão, Chaves SSH/JWT e Logins de Admin** em uma gaveta selada do `.NET` chamada "Tokens User-Secrets" que reside na pasta raiz do usuário físico (Ex: `C:\Users\Sertoriel\AppData\...`). Os Controles ASP.NET conseguem sugar essas chaves por herança mágica de ambiente de forma inviolável.

## 3.2 Por quê Contêineres Docker?
O SQLite é fantástico para testarmos e brincarmos em portfólios rudimentares. Mas para um Full Stack avançar para simulações de alto tráfego escalável, ele impedia concorrência simultânea intensa de Leitura/Escrita e trazia problemas graves de Locks de Arquivos locais. 

1. Construímos o YAML `docker-compose`.
2. Baixamos e ligamos o `postgres:16-alpine`.
3. O Backend injeta o ORM "Entity Framework Core" utilizando o compilador de tradução nativa "Npgsql".
4. Qualquer PC ou servidor rodando o código nunca precisa re-instalar o banco. Basta executar o orquestrador e a mágica se refaz perfeitamente isolada na porta 5432 do ecossistema.

## 3.3 JWT (JSON Web Token) Payload Protection
O `AuthController` rege a camada *State-less* do sistema, ou seja, diferente de antigamente, o servidor não possui sessões abertas engolindo memória das máquinas. Quando alguém interage para criar e editar Projetos e Postagens do Blog, o .NET Core exige que o Header da conexão valide o seu `Token`. O Token é verificado e devolve uma carga útil garantindo níveis rigorosos de permissões na Edição/Exclusão do banco.

---
### Fim da Documentação
* [⬅️ Voltar para Pág 2: FrontEnd e UI/UX](./2-arquitetura-frontend.md)
* [Voltar para a Página Inicial](../README.md)
