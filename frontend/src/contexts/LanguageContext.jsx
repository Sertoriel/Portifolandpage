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
    footer_admin: "Acesso Administrativo"
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
    footer_admin: "Admin Access"
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
