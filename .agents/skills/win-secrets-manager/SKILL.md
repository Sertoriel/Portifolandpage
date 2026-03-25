---
name: win-secrets-manager
description: Gerencia as chaves e credenciais sensíveis do backend .NET usando o 'dotnet user-secrets' no Windows. Use quando precisarmos salvar chaves de API, senhas de banco ou SMTP sem expor no código.
parameters:
  - name: key
    type: string
    description: "O nome da chave de configuração (ex: 'EmailSettings:SmtpPass')."
  - name: value
    type: string
    description: "O valor secreto a ser salvo."
---

# Instruções
Execute o script PowerShell `.\manage-secrets.ps1 -Key "{key}" -Value "{value}"` dentro do diretório da skill.