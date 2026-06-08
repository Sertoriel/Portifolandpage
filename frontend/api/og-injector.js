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

function generateMinimalHtml(title, description, imageUrl, pageType) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:type" content="${escapeHtml(pageType)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:image" content="${escapeHtml(imageUrl)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
</body>
</html>`;
}

function replaceOrAddMetaProperty(html, property, content) {
  const escapedContent = escapeHtml(content);
  const regex = new RegExp(`<meta\\s+property="${property}"\\s+content="[^"]*"\\s*\\/?>`, 'i');
  const tag = `<meta property="${property}" content="${escapedContent}" />`;
  
  if (regex.test(html)) {
    return html.replace(regex, tag);
  } else {
    return html.replace('</head>', `  ${tag}\n</head>`);
  }
}

function replaceOrAddMetaName(html, name, content) {
  const escapedContent = escapeHtml(content);
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
      const cleanId = encodeURIComponent(String(id).trim());
      const response = await fetch(`${apiUrl}/projects/${cleanId}`);
      if (response.ok) {
        const project = await response.json();
        title = `${project.title} - Projeto`;
        description = project.shortDescription || project.fullDescription || description;
        
        if (project.thumbnailUrl && project.thumbnailUrl.startsWith('http')) {
          imageUrl = project.thumbnailUrl;
        } else {
          imageUrl = `${absoluteUrlBase}/api/og?title=${encodeURIComponent(project.title)}&category=${encodeURIComponent(project.category || 'Projeto')}`;
        }
        pageType = 'article';
      }
    } else if (type === 'blog' && slug) {
      // Remove encoding duplicado caso o slug venha com escape
      let cleanSlug = slug;
      if (String(slug).includes('%')) {
        try {
          cleanSlug = decodeURIComponent(slug);
        } catch (_) {}
      }
      const response = await fetch(`${apiUrl}/Blog/${encodeURIComponent(cleanSlug)}`);
      if (response.ok) {
        const post = await response.json();
        title = post.title;
        description = post.summary || description;
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
  }

  // Leitura do index.html gerado pelo build do Vite
  let htmlPath = path.join(process.cwd(), 'dist', 'index.html');
  
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

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    console.error("Erro ao ler index.html. Servindo HTML mínimo resiliente de fallback:", err.message);
    // Fallback de resiliência máxima: se falhar a leitura física do index.html, serve o HTML básico
    // contendo os cabeçalhos de metatags que os robôs precisam para gerar o preview
    const fallbackHtml = generateMinimalHtml(title, description, imageUrl, pageType);
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(fallbackHtml);
  }
}
