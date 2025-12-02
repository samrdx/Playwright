# PowerShell script to stage and commit the recent test hardening changes
# Run from the repository root: `./commit/do_commit.ps1`

# Verify current branch
git branch --show-current

# Stage the updated test file
git add mytest/crear_viaje_corrected.spec.ts

# Add the commit message file for context (optional)
git add commit/COMMIT_MESSAGE.txt

# Commit with the prepared message
git commit -F commit/COMMIT_MESSAGE.txt

# Push to the current branch (main assumed)
git push origin main

# If you prefer to create a new branch instead of pushing to main, uncomment and use:
# git checkout -b fix/robust-select-2025-12-02
# git push -u origin fix/robust-select-2025-12-02

Write-Host "Commit script finished. Check git status for any conflicts or required credentials." -ForegroundColor Green
