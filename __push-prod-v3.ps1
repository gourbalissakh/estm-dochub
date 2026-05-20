Set-Location 'c:\Users\user\Desktop\Idee-projets\DocHub\estm-dochub'

Write-Output '=== Pull prod env ==='
npx --yes vercel@latest env pull .env.production.local --environment=production --yes 2>&1 | Out-Null
if (-not (Test-Path '.env.production.local')) { Write-Output 'pull failed'; exit 1 }

$prodEnv = Get-Content '.env.production.local'
$dbLine = $prodEnv | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
$dbUrl = $dbLine -replace '^DATABASE_URL=', '' -replace '^"', '' -replace '"$', ''
if (-not $dbUrl) { Write-Output 'no prod URL parsed'; exit 1 }
Write-Output 'Prod URL captured.'

Write-Output ''
Write-Output '=== Backup .env, swap DATABASE_URL ==='
Copy-Item '.env' '.env.dev.bak' -Force
$origContent = Get-Content '.env'
$newContent = $origContent | ForEach-Object {
    if ($_ -match '^DATABASE_URL=') { "DATABASE_URL=`"$dbUrl`"" } else { $_ }
}
$newContent | Set-Content '.env'

Write-Output ''
Write-Output '=== Push schema to PROD DB ==='
npx prisma db push --skip-generate --accept-data-loss
$pushExit = $LASTEXITCODE

Write-Output ''
Write-Output '=== Restore .env ==='
Move-Item '.env.dev.bak' '.env' -Force
Remove-Item '.env.production.local' -Force -ErrorAction SilentlyContinue
if ($pushExit -ne 0) { Write-Output "PROD PUSH FAILED"; exit $pushExit }

Write-Output ''
Write-Output '=== Typecheck ==='
npx tsc --noEmit
exit $LASTEXITCODE
