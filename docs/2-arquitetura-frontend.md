# 🎨 2. Arquitetura Frontend e UI/UX

Ao acessar a interface web visual do `Sertori.dev`, a composição de pastas em cima do Framework **React 18** mesclada com a engine do **Vite** garante *builds* de miléssegundos e reatividade pesada sem penalidades graves de banda de memória.

## Gerenciamento de Estilização Principal
O Frontend adota um dogma rígido: **Apenas Tailwind CSS.** 
Qualquer arquivo que transborde regras cruas de `.css` comuns foi substituído pelas diretivas fluídas do Tailwind, construindo um `Dark Theme` global e classes utilitárias que reagem perfeitamente à resolução mobile e desktop.

### 2.1 Animação "Glitch" e Ghostty
A primeira zona que seu usuário intercepta (a *Hero Section*) possui injeção de Lottie-JS unida à quebra de Strings em tempo real para forjar um comportamento similar à máquinas de escrever dos *Cyberpunks*. Isso roda lado-a-lado a uma modelagem CSS que emula frames estáticos das abas do Ghostty Terminal do Linux/MacOS.

### 2.2 Motor de Artigos e Markdown Reader
Quando a entidade requere os blocos de leitura longos, a classe `react-markdown` transforma dados crus em Nodes semânticos de HTML legível, colorindo o `syntaxhighlight` ao avistar blocos de códigos isolados no Backend.

### 2.3 Smart Menu e Table of Contents
Nos artigos, nós inserimos um regex inteligente (`String.match`) e interceptações no Componente React: 
1. Puxamos as Tags formatadas em Cabeçalhos do markdown (`# Titulo 1`, `## Titulo 2`)
2. Formatamos tudo construindo Strings minúsculas de *ID anchors (`#titulo-1`)*
3. A Árvore é injetada colapsada numa SideBar. O Leitor vê uma "Árvore de Leitura" automática onde a cada clique a tela faz scroll macio na vertical exata do bloco referenciado (*Slide to On Click* offset 100px para fugir da NavBar).

### Navegação Pelos Documentos:
* [⬅️ Voltar para Pág 1: Visão Geral](./1-visao-geral.md)
* [➡️ Ir para Pág 3: Backend & BD](./3-arquitetura-backend-db.md)
