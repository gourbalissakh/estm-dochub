Set-Location 'c:\Users\user\Desktop\Idee-projets\DocHub\estm-dochub'

Write-Output '=== Push schema to PROD DB ==='
$prodEnv = Get-Content '.env.production.local'
$dbLine = $prodEnv | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
$dbUrl = $dbLine -replace '^DATABASE_URL=', '' -replace '^"', '' -replace '"$', ''
$env:DATABASE_URL = $dbUrl
npx prisma db push --skip-generate --accept-data-loss
$pushExit = $LASTEXITCODE
Remove-Item Env:DATABASE_URL
if ($pushExit -ne 0) { Write-Output "PROD PUSH FAILED ($pushExit)"; exit $pushExit }

Write-Output ''
Write-Output '=== Typecheck ==='
npx tsc --noEmit
$tcExit = $LASTEXITCODE

Write-Output ''
Write-Output '=== Cleanup ==='
Remove-Item '.env.production.local' -Force
Write-Output "Typecheck exit: $tcExit"
exit $tcExit
