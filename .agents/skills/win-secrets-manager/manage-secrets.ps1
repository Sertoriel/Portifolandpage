# Executa no PowerShell para gerenciar User Secrets do .NET
param (
    [Parameter(Mandatory=$true)][string]$Key,
    [Parameter(Mandatory=$true)][string]$Value
)

$BackendDir = "..\..\backend"
Set-Location -Path $BackendDir

Write-Host "Injetando segredo localmente para a chave: $Key" -ForegroundColor Cyan

# Executa o comando do CLI do .NET para adicionar o segredo
dotnet user-secrets set "$Key" "$Value"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Segredo salvo com sucesso no ambiente Windows." -ForegroundColor Green
} else {
    Write-Host "Erro ao salvar o segredo. Verifique se o projeto backend foi inicializado com 'dotnet user-secrets init'." -ForegroundColor Red
    exit 1
}