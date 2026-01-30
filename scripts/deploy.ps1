# Deploy automático: Vercel
# Execute na pasta do projeto: .\scripts\deploy.ps1
# Ou: npm run deploy (após fazer login uma vez com: npx vercel login)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

Write-Host "Verificando login na Vercel..." -ForegroundColor Cyan
$loginCheck = npx vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Você precisa fazer login na Vercel (abre o navegador)." -ForegroundColor Yellow
    npx vercel login
    if ($LASTEXITCODE -ne 0) { exit 1 }
}

Write-Host "Fazendo deploy..." -ForegroundColor Cyan
npx vercel --prod --yes
if ($LASTEXITCODE -eq 0) {
    Write-Host "Deploy concluído. O site está no ar!" -ForegroundColor Green
} else {
    exit 1
}
