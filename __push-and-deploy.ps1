$ErrorActionPreference = 'Stop'
Set-Location 'c:\Users\user\Desktop\Idee-projets\DocHub\estm-dochub'

Write-Output '=== 1. Push schema to LOCAL DB ==='
npx prisma db push --skip-generate --accept-data-loss
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Output ''
Write-Output '=== 2. Pull prod env vars ==='
npx --yes vercel@latest env pull .env.production.local --environment=production --yes 2>&1 | Select-Object -Last 3

Write-Output ''
Write-Output '=== 3. Push schema to PROD DB ==='
$prodEnv = Get-Content '.env.production.local'
$dbLine = $prodEnv | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
$dbUrl = $dbLine -replace '^DATABASE_URL=', '' -replace '^"', '' -replace '"$', ''
$origUrl = $env:DATABASE_URL
$env:DATABASE_URL = $dbUrl
try {
    npx prisma db push --skip-generate --accept-data-loss
    if ($LASTEXITCODE -ne 0) { exit 1 }
} finally {
    if ($origUrl) { $env:DATABASE_URL = $origUrl } else { Remove-Item Env:DATABASE_URL }
}

Write-Output ''
Write-Output '=== 4. Typecheck ==='
npx tsc --noEmit
if ($LASTEXITCODE -ne 0) { exit 1 }

Write-Output ''
Write-Output '=== 5. Cleanup prod env ==='
Remove-Item '.env.production.local' -Force
Write-Output 'Done.'
