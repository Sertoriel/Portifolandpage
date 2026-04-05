<h1 align="center">
  🚀 Sertori.dev | Full-Stack Portfólio & Blog Acadêmico
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <br/>
  <img src="https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10" />
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

> Plataforma imersiva, responsiva e internacionalizada desenvolvida para exibir projetos robustos de Engenharia de Software. Construída em arquitetura Clean N-Tier com uma interface estética *Hacker/IDE* (Glassmorphism e tipografia JetBrains Mono) conectada a uma API restrita em .NET 10 hospedada sob contêineres Docker.

---

## ✨ Funcionalidades em Destaque

### 🌐 Automações e UX Dinâmica (Frontend)
- **i18n Nativo:** Todo o painel, portfólios e artigos se traduzem automaticamente de Português (PT-BR) para Inglês (EN-US) sob demanda do Context API.
- **Hero Section "Ghostty Terminal":** Apresentação simulando ambiente Bash de terminal interativo com efeitos `Typewriter` e injeção de ASCII Arts em tempo real.
- **Blog System:** Renderizador de arquivos Markdown focado e orgânico para artigos.
- **Navegação Smart Sidebar:** Sidebars "On This Page" com busca instantânea, agrupamento automatizado por data e extração de *Table of Contents* (Índice de Títulos H1-H3) injetandos via `rehype/ReactMarkdown`.
- **Efeitos Premium:** Backgrounds de Blur-Glass, Botões baseados em JSON dinâmicos (Lottie Animation) e transições entre rotas via `Framer Motion`.

### 🔒 Dados e Infraestrutura (Backend)
- **PostgreSQL em Docker:** Alta integridade transacional escalonável operando sob persistência em contêineres nativos, com suporte a Mapeamento Geográfico via Npgsql.
- **User Secrets & Segurança Rigorosa:** As configurações estocam zero credenciais no código-fonte, barrando vazamentos críticos na web.
- **Painel Administrativo:** CRUD fechado com validação JWT. Cria, edita e versiona projetos e artigos entre "Rascunhos" e "Publicados" sem esforço.
- **Documentação de API:** Mapeamento visual em tempo real construído em **Scalar API**.

---

## 📚 Documentação Aprofundada
Desenvolvemos uma coletânea técnica rica de arquivos Markdown nas dependências da pasta `/docs`. Se quiser entender a matemática dos recursos do projeto a fundo:
- [📖 1. Visão Geral e Estrutura](./docs/1-visao-geral.md)
- [🎨 2. Arquitetura Frontend & UI/UX](./docs/2-arquitetura-frontend.md)
- [⚙️ 3. Arquitetura Backend & Banco de Dados](./docs/3-arquitetura-backend-db.md)

---

## 🚀 Como baixar e rodar localmente (Sem vazamentos)

### Pré-requisitos
- [Node.js (18+)](https://nodejs.org/)
- [.NET SDK 10](https://dotnet.microsoft.com/)
- [Docker Desktop](https://www.docker.com/) rodando no sistema.

### 1. Preparando Banco de Dados e API (.NET)
Abra um terminal na pasta responsável pela base lógica:
```bash
cd backend
```

**Criar e isolar as chaves de segurança localmente (Dotnet User Secrets):**
*Nenhuma chave inserida aqui jamais subirá para o GitHub.*
```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "SuaChaveUltraSecretaDePeloMenos25Caracteres!!"
dotnet user-secrets set "AdminLogin:Username" "nome_usuario_sua_escolha"
dotnet user-secrets set "AdminLogin:Password" "senha_forte_aqui"
```

**Subindo a Infraestrutura (Docker) e gerando Tabelas:**
```bash
# Baixa e engatilha o motor do PostgreSQL (porta 5432)
docker compose up -d

# Aplica as regras de negócios (C#) e gera os Schemas do Banco
dotnet ef database update

# Inicializa as rotas da API em http://localhost:5000/
dotnet watch
```
*(As chaves do projeto de endpoints e documentações paramétricas aparecerão acessando `http://localhost:5000/scalar/v1` no seu browser).*

### 2. Preparando a Interface do Usuário (React)
Abra uma janela de terminal paralela na pasta visual:
```bash
cd frontend
```

**Baixando dependências e Inicilizando o Vite:**
```bash
npm install
npm run dev
```
O frontend reagirá automaticamente e despertará sua imersão em `http://localhost:5173`. Aproveite o porte premium e modifique à vontade!

---

<p align="center">
👤 <b>Autor: João Arthur (Software Engineer & Game Developer)</b><br/>
<a href="https://github.com/Sertoriel">GitHub</a> • <a href="www.linkedin.com/in/joao-arthur-duarte">LinkedIn</a> • ✉️ jotaduarfar@gmail.com
<br/><br/>
<i>Construído sob o rigor de um hacker.</i> ☕
</p>