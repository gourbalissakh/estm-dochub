Set-Location 'c:\Users\user\Desktop\Idee-projets\DocHub\estm-dochub'

Write-Output '=== 1. Regenerate Prisma client (local schema) ==='
npx prisma generate
if ($LASTEXITCODE -ne 0) { Write-Output 'generate failed'; exit 1 }

Write-Output ''
Write-Output '=== 2. Backup .env and swap with prod URL ==='
Copy-Item '.env' '.env.dev.bak' -Force

# Extract prod DB URL
$prodEnv = Get-Content '.env.production.local'
$dbLine = $prodEnv | Where-Object { $_ -match '^DATABASE_URL=' } | Select-Object -First 1
$dbUrl = $dbLine -replace '^DATABASE_URL=', '' -replace '^"', '' -replace '"$', ''
if (-not $dbUrl) { Write-Output 'no prod URL'; exit 1 }

# Write a temp .env with prod URL (only DATABASE_URL line)
$origContent = Get-Content '.env'
$newContent = $origContent | ForEach-Object {
    if ($_ -match '^DATABASE_URL=') { "DATABASE_URL=`"$dbUrl`"" } else { $_ }
}
$newContent | Set-Content '.env' -NoNewline

Write-Output ''
Write-Output '=== 3. Push schema to PROD DB ==='
npx prisma db push --skip-generate --accept-data-loss
$pushExit = $LASTEXITCODE

Write-Output ''
Write-Output '=== 4. Restore .env ==='
Move-Item '.env.dev.bak' '.env' -Force
if ($pushExit -ne 0) { Write-Output "PROD PUSH FAILED ($pushExit)"; exit $pushExit }

Write-Output ''
Write-Output '=== 5. Typecheck ==='
npx tsc --noEmit
$tcExit = $LASTEXITCODE

Write-Output ''
Write-Output '=== 6. Cleanup ==='
Remove-Item '.env.production.local' -Force -ErrorAction SilentlyContinue
Write-Output "Typecheck exit: $tcExit"
exit $tcExit
