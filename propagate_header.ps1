$indexFile = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu\index.html"
$targetDir = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu"

if (-not (Test-Path $indexFile)) {
    Write-Error "index.html not found at $indexFile"
    exit 1
}

$content = Get-Content $indexFile -Raw

# Extract Top Bar
if ($content -match '(?s)(<!-- TOP BAR.*?<div class="top-bar">.*?</div>\s*</div>)') {
    $topBar = $matches[0]
} else {
    Write-Error "Could not extract Top Bar from index.html"
    exit 1
}

# Extract Header
if ($content -match '(?s)(<!-- HEADER & NAVIGATION.*?<header.*?</header>)') {
    $header = $matches[0]
} else {
    Write-Error "Could not extract Header from index.html"
    exit 1
}

$files = Get-ChildItem -Path $targetDir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }
$count = 0

foreach ($file in $files) {
    try {
        $fileContent = Get-Content $file.FullName -Raw
        $originalContent = $fileContent
        
        # Replace Top Bar
        # We assume the structure is somewhat consistent with comments
        # Using a regex that looks for the comment and loosely the end of the div structure
        # If the file doesn't have the exact comments, this might fail, but let's assume valid structure based on previous interactions
        
        $fileContent = $fileContent -replace '(?s)<!-- TOP BAR.*?<div class="top-bar">.*?</div>\s*</div>', $topBar
        
        # Replace Header
        $fileContent = $fileContent -replace '(?s)<!-- HEADER & NAVIGATION.*?<header.*?</header>', $header
        
        if ($fileContent -ne $originalContent) {
            Set-Content -Path $file.FullName -Value $fileContent -Encoding UTF8
            Write-Host "Updated $($file.Name)"
            $count++
        } else {
            Write-Host "No changes for $($file.Name) (pattern not found or already up to date)"
        }
    } catch {
        Write-Error "Failed to process $($file.Name): $_"
    }
}

Write-Host "Total files updated: $count"
