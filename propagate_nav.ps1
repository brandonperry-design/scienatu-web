
$indexFile = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu\index.html"
$directory = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu"

# Read index.html and extract the header
$indexContent = Get-Content -Path $indexFile -Raw -Encoding UTF8
if ($indexContent -match '(?ms)(<header.*?</header>)') {
    $headerContent = $matches[1]
}
else {
    Write-Error "Could not find header in index.html"
    Exit
}

# Propagate to other files
Get-ChildItem -Path $directory -Filter *.html | Where-Object { $_.Name -ne "index.html" } | ForEach-Object {
    $fileContent = Get-Content -Path $_.FullName -Raw -Encoding UTF8
    
    if ($fileContent -match '(?ms)(<header.*?</header>)') {
        Write-Host "Updating header in $($_.Name)..."
        $newContent = $fileContent -replace '(?ms)(<header.*?</header>)', $headerContent
        Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8
    }
    else {
        Write-Host "Skipping $($_.Name) - No header tag found."
    }
}

Write-Host "Header propagation complete."
