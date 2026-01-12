#!/usr/bin/env pwsh
# Setup script for Polaris CLI - One shot installation

Write-Host "🚀 Polaris Setup - Configuration automatique" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check gcloud authentication
Write-Host "📋 Étape 1/4 : Vérification de l'authentification gcloud..." -ForegroundColor Yellow
try {
    $gcloudAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
    if (-not $gcloudAccount) {
        Write-Host "❌ Aucun compte gcloud actif trouvé" -ForegroundColor Red
        Write-Host "   Exécutez: gcloud auth login" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "✅ Authentifié avec: $gcloudAccount" -ForegroundColor Green
} catch {
    Write-Host "❌ gcloud CLI non installé" -ForegroundColor Red
    Write-Host "   Installez depuis: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Step 2: Create global .npmrc with @polaris scope
Write-Host ""
Write-Host "📋 Étape 2/4 : Configuration du registry npm..." -ForegroundColor Yellow
$npmrcPath = Join-Path $HOME ".npmrc"
$registryUrl = "https://europe-west1-npm.pkg.dev/itg-btshared-gbl-ww-pd/oo-ar-web-packages-ew1-pd/"

$npmrcContent = @"
@polaris:registry=$registryUrl
//$($registryUrl.Replace('https://', '')):always-auth=true
"@

Set-Content -Path $npmrcPath -Value $npmrcContent -Force
Write-Host "✅ Fichier .npmrc créé dans $npmrcPath" -ForegroundColor Green

# Step 3: Authenticate with Artifact Registry
Write-Host ""
Write-Host "📋 Étape 3/4 : Authentification Artifact Registry..." -ForegroundColor Yellow
try {
    npx --yes google-artifactregistry-auth $npmrcPath
    Write-Host "✅ Token d'authentification ajouté" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec de l'authentification" -ForegroundColor Red
    exit 1
}

# Step 4: Install Polaris CLI globally
Write-Host ""
Write-Host "📋 Étape 4/4 : Installation de @polaris/cli..." -ForegroundColor Yellow
try {
    npm install -g @polaris/cli
    Write-Host "✅ CLI installée avec succès" -ForegroundColor Green
} catch {
    Write-Host "❌ Échec de l'installation" -ForegroundColor Red
    exit 1
}

# Success!
Write-Host ""
Write-Host "🎉 Installation terminée !" -ForegroundColor Green
Write-Host ""
Write-Host "Vous pouvez maintenant utiliser:" -ForegroundColor Cyan
Write-Host "  polaris init <template>  - Créer un nouveau projet" -ForegroundColor White
Write-Host "  polaris add <module>     - Ajouter un module Polaris" -ForegroundColor White
Write-Host "  polaris setup            - Configurer un projet existant" -ForegroundColor White
Write-Host ""
