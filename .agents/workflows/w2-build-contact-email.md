---
description: Integração de Formulário de Contato e MailKit
---

Objetivo: Criar o fluxo completo para o usuário enviar uma mensagem pelo frontend e o backend disparar um e-mail real.

Passos para o Agente Executar:
1. **Backend:** Navegue para `.\backend` e adicione o pacote `MailKit` ao `.csproj`.
2. Crie uma interface `IEmailService` e a classe `EmailService` encapsulando a lógica de envio SMTP.
3. Crie um `ContactController` com um endpoint `POST /api/contact` que receba `nome, email, mensagem`. Injete o `IEmailService`.
4. Pare e peça ao usuário para usar a skill `win-secrets-manager` para configurar suas credenciais SMTP (`SmtpUser`, `SmtpPass`).
5. **Frontend:** Vá para `.\frontend` e crie o componente `ContactForm.jsx` utilizando Tailwind CSS e `Framer Motion` para o feedback visual de "Enviando...", "Sucesso" e "Erro".
6. Integre o formulário para fazer um `fetch` POST para a nova rota da API.