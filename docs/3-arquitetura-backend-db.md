# ⚙️ 3. Arquitetura Backend e Banco de Dados

Nos bastidores impenetráveis da aplicação reside a nossa Máquina Principal. Utilizando **.NET 10 (C#)** fundido com a robustez e performance bruta do Engine **PostgreSQL** montado em containers Docker.

## 3.1 Segurança via User Secrets (DotNet) e Variáveis de Ambiente
Jamais colocamos *Hardcoded Keys* em nossas classes dinâmicas, nem dependemos de subir arquivos `.env` cruciais que podem acidentalmente passar por desatenções de comitês `.gitignore`. 

O Backend isola **Strings de Conexão, Chaves JWT, Credenciais do Cloudinary e Logins de Admin** em uma gaveta selada do `.NET` chamada "Tokens User-Secrets" que reside na pasta raiz do usuário físico (Ex: `C:\Users\Sertoriel\AppData\...`). Os Controles ASP.NET conseguem sugar essas chaves por herança de ambiente de forma inviolável.
*Aviso de Produção:* Quando este projeto for para Cloud (Render/AWS), **nunca utilize as chaves de fallback do código**. Preencha rigorosamente as Variáveis de Ambiente no painel do host.

## 3.2 Por quê Contêineres Docker?
O SQLite é fantástico para testarmos e brincarmos em portfólios rudimentares. Mas para um Full Stack avançar para simulações de alto tráfego escalável, ele impedia concorrência simultânea intensa de Leitura/Escrita. 
1. Construímos o YAML `docker-compose`.
2. Baixamos e ligamos o `postgres:16-alpine`.
3. O Backend injeta o ORM "Entity Framework Core" utilizando o compilador de tradução nativa "Npgsql".
4. Qualquer PC rodando o código não precisa instalar o banco nativamente; basta subir o contêiner na porta 5432.

## 3.3 JWT (JSON Web Token) Payload Protection e State-less
O `AuthController` rege a camada *State-less* do sistema. O servidor não possui sessões abertas engolindo memória. Quando alguém interage para criar e editar Projetos, Documentos e Postagens do Blog, o .NET Core exige que o Header da conexão (Bearer) valide o seu `Token`. O Token é verificado garantindo bloqueio total para edições não autorizadas.

## 3.4 Armazenamento de Imagens e PDFS via Cloudinary
Para que a hospedagem seja barata e escalável (já que hosts gratuitos deletam dados do disco local no restart), implementamos uma integração via API ao **Cloudinary**.
O `ImageUploadService` é responsável por receber imagens e PDFs do painel de administração e jogá-los para a nuvem de imediato. 
*Nota Importante sobre Segurança e Padrões de PDF:* O Cloudinary bloqueia o "inline rendering" nativo do iFrame para contas limitadas/gratuitas. Portanto, quando o usuário envia um documento, injetamos a flag nativa `/upload/fl_attachment/` no backend. Isso obriga navegadores modernos a tratar a visualização e download de maneira confiável em todas as plataformas (Android, Desktop), mitigando falhas clássicas de iframe de PDF. No Frontend, nós substituímos essa flag magicamente para gerar uma thumbnail em `.jpg` na visualização dos certificados!

---
### Fim da Documentação
* [⬅️ Voltar para Pág 2: FrontEnd e UI/UX](./2-arquitetura-frontend.md)
* [Voltar para a Página Inicial](../README.md)
