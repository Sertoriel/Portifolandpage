---
trigger: always_on
description: Regras para proteger o frontend React, Tailwind e Framer Motion
---

Documentação Oficial Obrigatória
Consulte estas fontes antes de estruturar componentes ou sugerir novas bibliotecas visuais:
- React (Hooks e Arquitetura): https://react.dev/
- React Router (Navegação): https://reactrouter.com/
- Tailwind CSS (Estilização): https://tailwindcss.com/docs/
- Framer Motion (Animações): https://www.framer.com/motion/
- Lottie React (SVGs Animados): https://lottiereact.com/

Regras
1. **Estilização Exclusiva:** Utilize apenas Tailwind CSS. Mantenha o padrão de *Glassmorphism* (ex: `backdrop-blur-md`, `bg-opacity`) e *Dark Mode* já estabelecido. Não introduza CSS modules ou Styled Components.
2. **Animações Fluidas:** Todas as transições de página ou entrada de componentes (`Hero`, `FeatureSection`) devem utilizar o `Framer Motion` (`<motion.div>`).
3. **Arquivos Lottie:** Para estados de loading global ou páginas de erro (404), utilize os arquivos JSON existentes com a biblioteca `Lottie React`.
4. **Proteção de Rotas:** O painel `AdminDashboard` deve sempre validar a existência do token JWT no `localStorage` antes de renderizar, redirecionando para `/login` caso falhe.