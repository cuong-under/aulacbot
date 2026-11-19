<#
  Copies the seven asset-only Cyber Lạc files into the app and backs up what it replaces.
  Dry run by default; pass -Apply to write.

    pwsh -NoProfile -File docs/branding/cyber-lac/apply-assets.ps1
    pwsh -NoProfile -File docs/branding/cyber-lac/apply-assets.ps1 -Apply

  It deliberately does not touch favicon.ico, favicon.svg, apple-touch-icon.png, icon-512.png or
  the mobile/desktop app-icon sets: generators own those, and REPLACEMENT-MAP.md explains why.
#>
param([switch]$Apply)

$ErrorActionPreference = 'Stop'

$here = $PSScriptRoot
$repo = (Resolve-Path (Join-Path $here '../../..')).Path
$assets = Join-Path $here 'assets'
$stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$backup = Join-Path (Split-Path $repo -Parent) "outputs\brand-v4\backup-cyber-lac-$stamp"

$map = @(
  @{ From = 'cyber-lac-og-1200x630.png';   To = 'apps/web/public/og.png' },
  @{ From = 'email/logo-ink.png';          To = 'apps/web/public/email/logo-ink.png' },
  @{ From = 'email/logo-bone.png';         To = 'apps/web/public/email/logo-bone.png' },
  @{ From = 'email/logo-ink-tile.png';     To = 'apps/web/public/email/logo-ink-tile.png' },
  @{ From = 'email/mark.png';              To = 'apps/web/public/email/mark.png' },
  @{ From = 'cyber-lac-splash-512.png';    To = 'apps/mobile/assets/images/splash-icon.png' },
  @{ From = 'cyber-lac-notification-96.png'; To = 'apps/mobile/assets/images/notification-icon.png' }
)

$rows = foreach ($item in $map) {
  $from = Join-Path $assets $item.From
  $to = [IO.Path]::GetFullPath((Join-Path $repo $item.To))
  if (-not $to.StartsWith($repo, [StringComparison]::OrdinalIgnoreCase)) {
    throw "Refusing a target outside the repo: $to"
  }
  if (-not (Test-Path -LiteralPath $from)) { throw "Missing kit file: $from" }
  [pscustomobject]@{ From = $from; To = $to; Relative = $item.To }
}

$rows | Format-Table Relative, To -AutoSize | Out-String -Width 220 | Write-Output

if (-not $Apply) {
  Write-Output 'Dry run. Nothing written. Re-run with -Apply to copy and back up.'
  return
}

New-Item -ItemType Directory -Force -Path $backup | Out-Null
foreach ($row in $rows) {
  $name = $row.Relative.Replace('/', '__')
  if (Test-Path -LiteralPath $row.To) {
    Copy-Item -LiteralPath $row.To -Destination (Join-Path $backup $name) -Force
  }
  Copy-Item -LiteralPath $row.From -Destination $row.To -Force
  Write-Output "replaced $($row.Relative)"
}
Write-Output "Back-ups: $backup"
