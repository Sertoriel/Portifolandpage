import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const dictionary = {
  pt: {
    nav_home: "Início",
    nav_back_home: "Voltar para a Home",
    nav_projects: "Projetos",
    nav_blog: "Blog",
    nav_contact: "Contato",
    nav_articles_btn: "Ver Artigos 📝",

    hero_greeting: "Olá, eu sou",
    hero_description: "Software Engineer especializado em lógicas complexas e arquiteturas escaláveis. Desenvolvendo ferramentas sólidas e universos de jogos interativos.",
    hero_btn_projects: "Explorar Projetos ↓",
    hero_btn_blog: "Ler Artigos 📝",

    feat_title: "Meus",
    feat_title_span: "Projetos",
    feat_desc: "Navegue pelo meu repositório de desenvolvimento Back-end e Jogos.",
    feat_explore: "Explorar",
    feat_loading: "Carregando projetos do servidor...",
    feat_empty: "Nenhum projeto encontrado.",
    feat_empty_desc: "O banco de dados do .NET está vazio.",
    feat_error: "Erro de Conexão",

    contact_title: "Entre em Contato",
    contact_desc: "Tem um projeto em mente? Vamos conversar e transformá-lo em realidade.",
    contact_name: "Nome",
    contact_name_ph: "Seu nome",
    contact_email: "E-mail",
    contact_email_ph: "seu@email.com",
    contact_msg: "Mensagem",
    contact_msg_ph: "Como posso te ajudar?",
    contact_btn_sending: "Disparando E-mail...",
    contact_btn_send: "Enviar Mensagem",
    contact_success: "Mensagem enviada com sucesso! Entrarei em contato em breve.",
    
    footer_rights: "Todos os direitos reservados.",
    footer_admin: "Acesso Administrativo",

    proj_details_loading: "Carregando documentação...",
    proj_details_error: "Projeto não encontrado",
    proj_details_back: "← Voltar para o Portfólio",
    proj_details_repo: "Acessar Repositório (GitHub)",
    proj_details_download: "Baixar Build / Executável",

    blog_title: "Artigos e Pensamentos",
    blog_desc: "Escritos sobre tecnologia, tutoriais e ideias em andamento.",
    blog_read: "Ler Artigo",
    blog_empty: "Nenhum artigo publicado no momento.",
    blog_back: "← Voltar para a Home",
    blog_post_loading: "Carregando postagem...",
    blog_post_error: "Postagem não encontrada.",
    blog_post_back: "← Voltar ao Blog",
    blog_on_this_page: "Nesta página",
    blog_search_placeholder: "Pesquisar artigos...",
    blog_toc_title: "Índice",
    blog_toc_empty: "Este artigo não possui subdivisões."
  },
  en: {
    nav_home: "Home",
    nav_back_home: "Back to Home",
    nav_projects: "Projects",
    nav_blog: "Blog",
    nav_contact: "Contact",
    nav_articles_btn: "Read Articles 📝",

    hero_greeting: "Hello, I am",
    hero_description: "Software Engineer specializing in complex logic and scalable architectures. Building solid tools and interactive game universes.",
    hero_btn_projects: "Explore Projects ↓",
    hero_btn_blog: "Read Articles 📝",

    feat_title: "My",
    feat_title_span: "Projects",
    feat_desc: "Browse through my Back-end and Game development repository.",
    feat_explore: "Explore",
    feat_loading: "Loading projects from the server...",
    feat_empty: "No projects found.",
    feat_empty_desc: "The .NET database is empty.",
    feat_error: "Connection Error",

    contact_title: "Get in Touch",
    contact_desc: "Have a project in mind? Let's talk and make it a reality.",
    contact_name: "Name",
    contact_name_ph: "Your name",
    contact_email: "Email",
    contact_email_ph: "your@email.com",
    contact_msg: "Message",
    contact_msg_ph: "How can I help you?",
    contact_btn_sending: "Sending Email...",
    contact_btn_send: "Send Message",
    contact_success: "Message sent successfully! I will reach out soon.",
    
    footer_rights: "All rights reserved.",
    footer_admin: "Admin Access",

    proj_details_loading: "Loading documentation...",
    proj_details_error: "Project not found",
    proj_details_back: "← Back to Portfolio",
    proj_details_repo: "Access Repository (GitHub)",
    proj_details_download: "Download Build / Executable",

    blog_title: "Articles and Thoughts",
    blog_desc: "Writings on technology, tutorials, and ongoing ideas.",
    blog_read: "Read Article",
    blog_empty: "No articles published at the moment.",
    blog_back: "← Back to Home",
    blog_post_loading: "Loading post...",
    blog_post_error: "Post not found.",
    blog_post_back: "← Back to Blog",
    blog_on_this_page: "On this page",
    blog_search_placeholder: "Search articles...",
    blog_toc_title: "Table of Contents",
    blog_toc_empty: "This article has no sub-sections."
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pt');

  useEffect(() => {
    const savedLang = localStorage.getItem('appLang');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const newLang = prev === 'pt' ? 'en' : 'pt';
      localStorage.setItem('appLang', newLang);
      return newLang;
    });
  };

  const t = (key) => {
    return dictionary[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
