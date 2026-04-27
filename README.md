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

## 📢 Update Notes (Última Versão)
* **Internacionalização (i18n):** O sistema agora conta com um Context API nativo que injeta o dicionário de idiomas sem recarregar a tela, operando todas as abas e subpáginas (Português/Inglês).
* **Parallax nos Certificados:** O grid engessado de certificações deu lugar a Carrosséis Independentes Dinâmicos por categoria. Quando o usuário realiza o scroll, ocorre uma flutuação *Parallax* híbrida da esquerda para a direita calculada pelo Framer Motion.
* **Sistema Document Preview:** Visualização unificada (Theater Mode) interativa e protegida no carregamento de Currículo e Diplomas através do ecossistema PDF renderizado no Frontend via JPG preview-magics do Cloudinary.

---

## ✨ Funcionalidades em Destaque

### 🌐 Automações e UX Dinâmica (Frontend)
- **i18n Nativo:** Todo o painel de leitura, portfólios e navegações se adaptam ao idioma preferido com cliques instantâneos.
- **Hero Section "Ghostty Terminal":** Apresentação simulando ambiente Bash de terminal interativo com efeitos `Typewriter` e ASCII Arts injetadas em tempo real.
- **Blog System:** Renderizador inteligente de markdown focado e orgânico para artigos complexos com `syntaxhighlight`.
- **Efeitos Premium:** Backgrounds de Blur-Glass, Botões baseados em Lottie Animation e transições de rotas imersivas controladas por `Framer Motion`.

### 🔒 Dados e Infraestrutura (Backend)
- **PostgreSQL em Docker:** Banco sólido subido rapidamente via Container.
- **Cloudinary Integration:** Envio dinâmico de fotos e documentos da Área de Administração diretamente para a nuvem sem comprometer a persistência efêmera de discos de hospedagem gratuitas.
- **Painel Administrativo Fechado:** CRUD total sob tokens rigorosos JWT, capaz de manipular projetos e currículos.

---

## 📚 Documentação Aprofundada
Temos uma coletânea robusta de arquivos de arquitetura na pasta `/docs`. Se for forkar (bifurcar) o projeto, entenda essas estruturas primeiro:
- [📖 1. Visão Geral e Estrutura](./docs/1-visao-geral.md)
- [🎨 2. Arquitetura Frontend & UI/UX](./docs/2-arquitetura-frontend.md)
- [⚙️ 3. Arquitetura Backend & Banco de Dados](./docs/3-arquitetura-backend-db.md)

---

## 🚀 Como Forkar e Rodar Localmente

Gostou do portfólio e quer clonar e alterar para você sem engasgar e quebrar as rotas na primeira tentativa? Siga este manual cuidadosamente! **E o mais importante:** NUNCA vaze credenciais bancárias, chaves em código vivo, em `.env` que suba no `.gitignore` ou hardcoded nas strings de API!

### Pré-requisitos
- [Node.js (18+)](https://nodejs.org/)
- [.NET SDK 10](https://dotnet.microsoft.com/)
- Conta Gratuita no [Cloudinary](https://cloudinary.com/)
- [Docker Desktop](https://www.docker.com/) rodando no sistema.

### Passo 1: Preparando Banco de Dados e API (.NET)
Abra um terminal na pasta responsável pela base lógica:
```bash
cd backend
```

**Isolamento Absoluto de Chaves de Segurança (Dotnet User Secrets):**
*Nenhuma chave inserida aqui jamais subirá para o GitHub. Se não colocar essas variáveis, sua produção ficará comprometida e vulnerável com fallbacks hardcoded.*

```bash
dotnet user-secrets init
dotnet user-secrets set "Jwt:Key" "SUA_CHAVE_COMPLEXA_BEM_DIFICE_DE_QUEBRAR_123456!"
dotnet user-secrets set "AdminLogin:Username" "seu_username"
dotnet user-secrets set "AdminLogin:Password" "sua_senha_secreta"

# Pegue as chaves no Dashboard do Cloudinary para o Upload Mágico Funcionar
dotnet user-secrets set "Cloudinary:CloudName" "seu_nome_no_cloud"
dotnet user-secrets set "Cloudinary:ApiKey" "sua_chave_api_xyz"
dotnet user-secrets set "Cloudinary:ApiSecret" "seu_segredo_123abc"
```

**Subindo a Infraestrutura e DB:**
```bash
# Sobe o banco Postgres com Alpine (porta 5432)
docker compose up -d

# Compila suas migrações e acerta as tabelas
dotnet ef database update

# Inicializa as rotas da API em http://localhost:5000/
dotnet run
```
A sua API e sua documentação interativa baseada em **Scalar** surgirá em `http://localhost:5000/scalar/v1`.

### Passo 2: Preparando a Interface do Usuário (React)
Abra uma janela de terminal paralela e acesse o diretório visual:
```bash
cd frontend
```

**Variáveis de Ambiente (React):**
Crie um arquivo `.env` puro na raiz do seu `frontend` (verifique se ele está no `.gitignore`) contendo:
```env
VITE_API_URL=http://localhost:5000/api
```

**Baixando dependências e Inicializando:**
```bash
npm install
npm run dev
```

Pronto. O React acionará instantaneamente em `http://localhost:5173`. 
*(Lembre-se: O primeiro login de admin será regido pelo `AdminLogin` que você estipulou no `user-secrets`. Divirta-se personalizando a Home e postando seus próprios projetos).*

---

<p align="center">
👤 <b>Autor: João Arthur (Software Engineer & Game Developer)</b><br/>
<a href="https://github.com/Sertoriel">GitHub</a> • <a href="www.linkedin.com/in/joao-arthur-duarte">LinkedIn</a> • ✉️ jotaduarfar@gmail.com
<br/><br/>
<i>Construído sob o rigor de um hacker.</i> ☕
</p>