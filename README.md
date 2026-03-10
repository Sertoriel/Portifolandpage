<h1 align="center">
  🚀 Sertori.dev | Full-Stack Portfolio
</h1>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <br/>
  <img src="https://img.shields.io/badge/.NET_10-512BD4?style=for-the-badge&logo=dotnet&logoColor=white" alt=".NET 10" />
  <img src="https://img.shields.io/badge/C%23-239120?style=for-the-badge&logo=c-sharp&logoColor=white" alt="C#" />
  <img src="https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" />
</p>

> Plataforma interativa e responsiva desenvolvida para exibir projetos de Engenharia de Software e Game Development, com uma arquitetura dividida entre uma interface visual imersiva e uma API de gerenciamento segura.

## ✨ Funcionalidades

### 🌐 Área Pública (Frontend)
- **Hero Section Imersiva:** Apresentação dinâmica com animações complexas via `Framer Motion` e `Lottie`.
- **Carrossel de Projetos:** Exibição fluida dos projetos diretamente do banco de dados, com navegação suave e placeholders animados.
- **Páginas de Detalhes:** Rotas dinâmicas (`/projeto/:id`) carregando documentação, links do GitHub e downloads executáveis.
- **Design Glassmorphism:** Interface Dark Mode com efeitos de *glow* e desfoque de fundo (Tailwind CSS).

### 🔒 Área Administrativa (Backend & API)
- **Autenticação JWT:** Rota de Login protegida, garantindo que apenas administradores acessem o painel.
- **CRUD Completo:** Criação, Leitura, Atualização e Exclusão de projetos com persistência em banco de dados.
- **Painel Admin:** Interface no React dedicada ao gerenciamento do portfólio, exigindo *Bearer Token* em requisições seguras.
- **Documentação de API:** Mapeamento nativo OpenAPI com interface interativa *Scalar*.

---

## 🏗️ Arquitetura do Projeto

O projeto segue a arquitetura **N-Tier** (Camadas), separando estritamente a interface de usuário da lógica de negócios e acesso a dados:
- **`/frontend`**: Aplicação SPA em React (Vite). Consome a API RESTful.
- **`/backend`**: API em .NET 10 rodando com Entity Framework Core. Recebe requisições, valida tokens JWT e interage com o SQLite.

---

## 🛠️ Tecnologias Utilizadas

**Frontend:**
- React (Hooks, React Router)
- Vite (Build Tool)
- Tailwind CSS (Estilização)
- Framer Motion & Lottie React (Animações)

**Backend:**
- C# & .NET 10
- Entity Framework Core (ORM)
- SQLite (Banco de Dados Leve)
- Autenticação JWT (JSON Web Tokens)
- OpenAPI & Scalar (Documentação)

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (Para o Frontend)
- [.NET SDK 10.0+](https://dotnet.microsoft.com/) (Para a API)

### 1. Configurando a API (.NET)

Abra um terminal e navegue até a pasta do backend:
```bash
cd backend
Configure as variáveis de segurança locais (User Secrets) para o JWT e Login:

Bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "SuaChaveSuperSecretaMuitoLongaAqui123!@#"
dotnet user-secrets set "AdminLogin:Username" "seu_usuario"
dotnet user-secrets set "AdminLogin:Password" "sua_senha"
Gere o banco de dados e as tabelas:

Bash
dotnet ef database update
Inicie o servidor (geralmente rodará em http://localhost:5000):

Bash
dotnet watch
(Acesse http://localhost:5000/scalar/v1 para ver a documentação da API).

2. Configurando o Frontend (React)
Abra um novo terminal e navegue até a pasta do frontend:

Bash
cd frontend
Instale as dependências:

Bash
npm install
Inicie o servidor de desenvolvimento:

Bash
npm run dev
(Acesse http://localhost:5173 no seu navegador).

👤 Autor
João Arthur Software Engineer & Game Developer

GitHub

LinkedIn (Adicione seu link aqui)

Contato

<p align="center">
Desenvolvido com ☕ e muito código.
</p>