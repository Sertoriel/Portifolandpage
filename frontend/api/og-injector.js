import fs from 'fs';
import path from 'path';

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function replaceOrAddMetaProperty(html, property, content) {
  const escapedContent = escapeHtml(content);
  
  // Procura por meta tags existentes com property="og:..." ou property="twitter:..."
  const regex = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  const tag = `<meta property="${property}" content="${escapedContent}" />`;
  
  if (regex.test(html)) {
    return html.replace(regex, tag);
  } else {
    // Insere no head antes do fechamento </head>
    return html.replace('</head>', `  ${tag}\n</head>`);
  }
}

function replaceOrAddMetaName(html, name, content) {
  const escapedContent = escapeHtml(content);
  
  // Procura por meta tags existentes com name="description" ou name="twitter:..."
  const regex = new RegExp(`<meta\\s+name="${name}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  const tag = `<meta name="${name}" content="${escapedContent}" />`;
  
  if (regex.test(html)) {
    return html.replace(regex, tag);
  } else {
    return html.replace('</head>', `  ${tag}\n</head>`);
  }
}

export default async function handler(req, res) {
  const { query, headers } = req;
  const type = query.type || 'home';
  const id = query.id;
  const slug = query.slug;

  const host = headers.host || 'localhost:3000';
  // Vercel costuma rodar sobre https em prod, localmente podemos inferir pelo host
  const protocol = host.startsWith('localhost') ? 'http:' : 'https:';
  const absoluteUrlBase = `${protocol}//${host}`;

  // URL da API C# .NET
  const apiUrl = process.env.VITE_API_URL || process.env.BACKEND_API_URL || process.env.API_URL || 'http://localhost:5000/api';

  // Valores padrão de Open Graph (Fallback)
  let title = "Sertoriel's Portifolio";
  let description = "Portfolio de Sertoriel - Desenvolvedor Full Stack";
  let imageUrl = `${absoluteUrlBase}/ST.png`;
  let pageType = 'website';

  try {
    if (type === 'projeto' && id) {
      // Busca dados do projeto no Backend C#
      const response = await fetch(`${apiUrl}/projects/${id}`);
      if (response.ok) {
        const project = await response.json();
        title = `${project.title} - Projeto`;
        description = project.shortDescription || project.fullDescription || description;
        
        // Se houver uma thumbnail válida, usamos. Caso contrário, usamos a imagem dinâmica do @vercel/og
        if (project.thumbnailUrl && project.thumbnailUrl.startsWith('http')) {
          imageUrl = project.thumbnailUrl;
        } else {
          imageUrl = `${absoluteUrlBase}/api/og?title=${encodeURIComponent(project.title)}&category=${encodeURIComponent(project.category || 'Projeto')}`;
        }
        pageType = 'article';
      }
    } else if (type === 'blog' && slug) {
      // Busca dados do artigo do blog no Backend C#
      const response = await fetch(`${apiUrl}/Blog/${slug}`);
      if (response.ok) {
        const post = await response.json();
        title = post.title;
        description = post.summary || description;
        
        // O blog não tem Thumbnail no banco, então geramos o banner dinâmico usando nossa Edge Function
        imageUrl = `${absoluteUrlBase}/api/og?title=${encodeURIComponent(post.title)}&category=Blog`;
        pageType = 'article';
      }
    } else if (type === 'blog-list') {
      title = "Blog - Sertoriel";
      description = "Artigos sobre desenvolvimento de software, arquitetura de sistemas e tecnologia.";
      imageUrl = `${absoluteUrlBase}/api/og?title=Blog%20e%20Artigos&category=Blog`;
    }
  } catch (error) {
    console.error("Erro ao buscar dados do backend:", error.message);
    // Em caso de falha da API, mantemos os fallbacks padrão
  }

  // Leitura do index.html gerado pelo build do Vite
  let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
  
  // Se estiver rodando localmente sem pasta dist, usa o index.html raiz como fallback
  if (!fs.existsSync(htmlPath)) {
    htmlPath = path.join(process.cwd(), 'index.html');
  }

  try {
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Substituição das Tags Meta e Título
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(title)}</title>`);
    
    html = replaceOrAddMetaName(html, 'description', description);

    // Open Graph / Facebook
    html = replaceOrAddMetaProperty(html, 'og:type', pageType);
    html = replaceOrAddMetaProperty(html, 'og:title', title);
    html = replaceOrAddMetaProperty(html, 'og:description', description);
    html = replaceOrAddMetaProperty(html, 'og:image', imageUrl);

    // Twitter
    html = replaceOrAddMetaName(html, 'twitter:card', 'summary_large_image');
    html = replaceOrAddMetaName(html, 'twitter:title', title);
    html = replaceOrAddMetaName(html, 'twitter:description', description);
    html = replaceOrAddMetaName(html, 'twitter:image', imageUrl);

    // Envia a resposta final
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    console.error("Erro ao ler/processar o arquivo index.html:", err);
    res.status(500).send("Internal Server Error");
  }
}
