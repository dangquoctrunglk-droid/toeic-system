$targetDir = "$HOME\.antigravity"
if (!(Test-Path $targetDir)) { New-Item -ItemType Directory -Path $targetDir -Force }

# Copy rules
Copy-Item -Path ".\AGENTS.md" -Destination "$targetDir\AGENTS.md" -Force -ErrorAction SilentlyContinue
Copy-Item -Path ".\SOUL.md" -Destination "$targetDir\SOUL.md" -Force -ErrorAction SilentlyContinue

# Copy skills/plugins nếu có
if (Test-Path ".\skills") {
    Copy-Item -Path ".\skills" -Destination "$targetDir\" -Recurse -Force
}

Write-Host "Hoan tat cai dat cho Google Antigravity!" -ForegroundColor Green