# scripts/azure-provision.ps1
# Idempotent Azure provisioning for Baraka Assurance demo.

[CmdletBinding()]
param(
  [string]$ResourceGroup = 'rg-baraka-demo',
  [string]$Location = 'francecentral',
  [string]$PlanName = 'asp-baraka-demo',
  [string]$WebAppName = 'baraka-assurance-app',
  [string]$AiName = 'ai-baraka-demo',
  [string]$KeyVaultName
)

$ErrorActionPreference = 'Stop'
if (-not $KeyVaultName) {
  $KeyVaultName = ('kvbaraka' + ((Get-Random -Minimum 10000 -Maximum 99999).ToString()))
}

Write-Host "=== Azure provisioning for Baraka Assurance ===" -ForegroundColor Cyan
Write-Host "RG=$ResourceGroup | Loc=$Location | Plan=$PlanName | WebApp=$WebAppName | AI=$AiName | KV=$KeyVaultName"

function Invoke-Az {
  param([Parameter(ValueFromRemainingArguments)] [string[]]$Args)
  Write-Host "> az $($Args -join ' ')" -ForegroundColor DarkGray
  $out = & az @Args 2>&1
  if ($LASTEXITCODE -ne 0) {
    throw "az failed: $out"
  }
  return $out
}

Write-Host "`n[1/6] Resource Group" -ForegroundColor Yellow
Invoke-Az group create --name $ResourceGroup --location $Location --output none

Write-Host "`n[2/6] App Service Plan (B1 Linux)" -ForegroundColor Yellow
Invoke-Az appservice plan create `
  --name $PlanName `
  --resource-group $ResourceGroup `
  --sku B1 `
  --is-linux `
  --output none

Write-Host "`n[3/6] Web App (Node 22)" -ForegroundColor Yellow
Invoke-Az webapp create `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --plan $PlanName `
  --runtime 'NODE:22-lts' `
  --output none

Invoke-Az webapp config set `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --startup-file 'node server/index.js' `
  --output none

Invoke-Az webapp config appsettings set `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --settings WEBSITE_NODE_DEFAULT_VERSION='~22' SCM_DO_BUILD_DURING_DEPLOYMENT='false' `
  --output none

Write-Host "`n[4/6] Application Insights" -ForegroundColor Yellow
& az extension add --name application-insights --upgrade --only-show-errors 2>&1 | Out-Null
$aiExists = $null
try { $aiExists = & az monitor app-insights component show --app $AiName --resource-group $ResourceGroup --output json 2>$null } catch {}
if (-not $aiExists) {
  Invoke-Az monitor app-insights component create `
    --app $AiName `
    --location $Location `
    --resource-group $ResourceGroup `
    --application-type web `
    --output none
}
$aiKey = (& az monitor app-insights component show --app $AiName --resource-group $ResourceGroup --query instrumentationKey -o tsv)
$aiConn = (& az monitor app-insights component show --app $AiName --resource-group $ResourceGroup --query connectionString -o tsv)
Invoke-Az webapp config appsettings set `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --settings "APPINSIGHTS_INSTRUMENTATIONKEY=$aiKey" "APPLICATIONINSIGHTS_CONNECTION_STRING=$aiConn" `
  --output none

Write-Host "`n[5/6] Key Vault" -ForegroundColor Yellow
$kvExists = $null
try { $kvExists = & az keyvault show --name $KeyVaultName --resource-group $ResourceGroup --output json 2>$null } catch {}
if (-not $kvExists) {
  Invoke-Az keyvault create `
    --name $KeyVaultName `
    --resource-group $ResourceGroup `
    --location $Location `
    --sku standard `
    --output none
} else {
  Write-Host "   Key Vault $KeyVaultName already exists."
}

Write-Host "`n[6/6] HTTPS only" -ForegroundColor Yellow
Invoke-Az webapp update `
  --name $WebAppName `
  --resource-group $ResourceGroup `
  --https-only true `
  --output none

$publicUrl = "https://$WebAppName.azurewebsites.net"
Write-Host "`n=== PROVISIONING COMPLETE ===" -ForegroundColor Green
Write-Host "URL: $publicUrl"
Write-Host "Key Vault: $KeyVaultName"
Write-Host "Application Insights: $AiName"
