# PowerShell script to check theme usage patterns
Write-Host "🔍 Checking for improper useCountryTheme usage..." -ForegroundColor Cyan

$hasErrors = $false

# Find all TypeScript files that might use the theme hook
$files = Get-ChildItem -Path "src" -Recurse -Include "*.tsx", "*.ts"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $relativePath = $file.FullName.Replace((Get-Location).Path + "\", "")
    
    # Check if file imports useCountryTheme
    if ($content -match "import.*useCountryTheme") {
        
        # Check for missing parentheses (common mistake)
        if ($content -match "= useCountryTheme;") {
            Write-Host "❌ ERROR in $relativePath`: useCountryTheme called without ()" -ForegroundColor Red
            Write-Host "   Fix: const { theme } = useCountryTheme();" -ForegroundColor Yellow
            Write-Host ""
            $hasErrors = $true
        }
        
        # Check for missing 'use client' directive
        if (-not ($content -match "'use client'") -and -not ($content -match '"use client"')) {
            Write-Host "⚠️  WARNING in $relativePath`: Missing 'use client' directive" -ForegroundColor Yellow
            Write-Host "   Add: 'use client' at the top of the file" -ForegroundColor Gray
            Write-Host ""
        }
        
        # Check for rendering theme object directly
        if ($content -match "\{theme\}") {
            Write-Host "❌ ERROR in $relativePath`: Rendering theme object directly" -ForegroundColor Red
            Write-Host "   Fix: Use {theme.name} or other specific properties" -ForegroundColor Yellow
            Write-Host ""
            $hasErrors = $true
        }
    }
}

if ($hasErrors) {
    Write-Host "❌ Theme usage check failed. Please fix the errors above." -ForegroundColor Red
    exit 1
} else {
    Write-Host "✅ Theme usage check complete - No issues found!" -ForegroundColor Green
}