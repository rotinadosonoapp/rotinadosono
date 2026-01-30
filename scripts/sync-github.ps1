# Sincroniza o projeto com https://github.com/rotinadosonoapp/rotinadosono.git
# Requer: Git instalado (https://git-scm.com/download/win)
# Execute na pasta do projeto: .\scripts\sync-github.ps1

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

$remote = "https://github.com/rotinadosonoapp/rotinadosono.git"

# Verificar se Git está disponível
try {
    $null = git --version
} catch {
    Write-Host "ERRO: Git nao encontrado. Instale em: https://git-scm.com/download/win" -ForegroundColor Red
    Write-Host "Depois feche e abra o terminal e execute este script novamente." -ForegroundColor Yellow
    exit 1
}

# Inicializar repo se nao existir
if (-not (Test-Path ".git")) {
    Write-Host "Inicializando Git..." -ForegroundColor Cyan
    git init
}

# Configurar remote (adiciona ou atualiza origin)
$currentRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Adicionando remote origin..." -ForegroundColor Cyan
    git remote add origin $remote
} elseif ($currentRemote -ne $remote) {
    Write-Host "Atualizando remote origin..." -ForegroundColor Cyan
    git remote set-url origin $remote
}

# Adicionar todos os arquivos, commit e push
Write-Host "Adicionando arquivos..." -ForegroundColor Cyan
git add .

$status = git status --short
if (-not $status) {
    Write-Host "Nenhuma alteracao para enviar. Projeto ja esta sincronizado." -ForegroundColor Green
    exit 0
}

Write-Host "Criando commit..." -ForegroundColor Cyan
git commit -m "Sync: Rotina do Sono - site e config Vercel/Supabase"

Write-Host "Garantindo branch main..." -ForegroundColor Cyan
git branch -M main

Write-Host "Enviando para GitHub..." -ForegroundColor Cyan
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Sincronizado com sucesso: $remote" -ForegroundColor Green
} else {
    Write-Host "Falha no push. Se pedir login, use token ou GitHub CLI (gh auth login)." -ForegroundColor Yellow
    exit 1
}
