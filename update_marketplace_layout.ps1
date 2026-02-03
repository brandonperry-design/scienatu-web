
# DEFINITIONS
# Similar to customize_pages, but focused on the layout of a single page (marketplace.html)

$parents = @{
    "Building Materials" = @(
        @{Name = "Lumber"; Link = "lumber.html"; Icon = "fa-tree" },
        @{Name = "Decking"; Link = "decking.html"; Icon = "fa-layer-group" },
        @{Name = "Fencing"; Link = "fencing.html"; Icon = "fa-bars" },
        @{Name = "Flooring"; Link = "flooring.html"; Icon = "fa-square" },
        @{Name = "Windows"; Link = "windows.html"; Icon = "fa-window-maximize" },
        @{Name = "Doors"; Link = "doors.html"; Icon = "fa-door-open" },
        @{Name = "Paint"; Link = "paint.html"; Icon = "fa-paint-roller" },
        @{Name = "Hardware"; Link = "hardware.html"; Icon = "fa-hammer" }
    )
    "Tools & Systems"    = @(
        @{Name = "Tools"; Link = "tools.html"; Icon = "fa-tools" },
        @{Name = "Outdoor Power"; Link = "outdoor-power.html"; Icon = "fa-cogs" },
        @{Name = "Electrical"; Link = "electrical.html"; Icon = "fa-bolt" },
        @{Name = "Heating & HVAC"; Link = "heating-hvac.html"; Icon = "fa-wind" }
    )
    "Kitchen & Bath"     = @(
        @{Name = "Kitchen"; Link = "kitchen.html"; Icon = "fa-utensils" },
        @{Name = "Bath"; Link = "bath.html"; Icon = "fa-bath" },
        @{Name = "Plumbing"; Link = "plumbing.html"; Icon = "fa-faucet" },
        @{Name = "Appliances"; Link = "appliances.html"; Icon = "fa-blender" },
        @{Name = "Lighting"; Link = "lighting.html"; Icon = "fa-lightbulb" }
    )
    "Home & Decor"       = @(
        @{Name = "Furniture"; Link = "furniture-home.html"; Icon = "fa-couch" },
        @{Name = "Window Treatments"; Link = "window-treatments.html"; Icon = "fa-columns" },
        @{Name = "Storage"; Link = "storage.html"; Icon = "fa-boxes" },
        @{Name = "Clothing"; Link = "clothing.html"; Icon = "fa-tshirt" }
    )
    "Outdoor Living"     = @(
        @{Name = "Outdoors"; Link = "outdoors.html"; Icon = "fa-campground" },
        @{Name = "Patio Furniture"; Link = "patio-furniture.html"; Icon = "fa-chair" }
    )
}

# Mapping for Parent Category Links
$parentLinks = @{
    "Building Materials" = "building-materials.html"
    "Tools & Systems"    = "tools-systems.html"
    "Kitchen & Bath"     = "kitchen-bath.html"
    "Home & Decor"       = "home-decor.html"
    "Outdoor Living"     = "outdoor-living.html"
}

$file = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu\marketplace.html"

# Generate Rows HTML
$html = @"
    <section class="section bg-offwhite">
        <div class="container">
            <h2 class="text-center mb-xl">Complete Category Catalog</h2>
            <p class="text-center mb-2xl" style="max-width: 600px; margin: 0 auto -2rem auto; color: var(--silver);">Explore our departments below</p>
"@

# ROBUST SORTING LOGIC
# create a temporary array of objects to sort
$sortList = @()
foreach ($key in $parents.Keys) {
    $count = $parents[$key].Count
    $obj = New-Object PSObject -Property @{
        Name  = $key
        Count = $count
    }
    $sortList += $obj
}

# Sort descending by Count
$sortedList = $sortList | Sort-Object Count -Descending

foreach ($item in $sortedList) {
    $catName = $item.Name
    $catLink = $parentLinks[$catName]
    
    # Generate Row
    $html += @"
            <div class="category-row" style="margin-bottom: var(--space-2xl);">
                <div class="flex-between mb-md" style="border-bottom: 2px solid var(--offwhite-dark); padding-bottom: var(--space-sm);">
                    <h3 style="color: var(--navy-blue); margin: 0;">$catName</h3>
                    <a href="$catLink" class="btn-text">View All <i class="fas fa-arrow-right"></i></a>
                </div>
                
                <div class="grid grid-4" style="gap: var(--space-lg);">
"@
    
    $subcats = $parents[$catName]
    foreach ($sc in $subcats) {
        $html += @"
                    <a href="$($sc.Link)" class="card-mini" style="display: flex; align-items: center; padding: var(--space-md); background: white; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); transition: transform 0.2s; text-decoration: none; color: inherit;">
                        <i class="fas $($sc.Icon)" style="font-size: 1.5rem; color: var(--patriot-red); margin-right: var(--space-md); width: 30px; text-align: center;"></i>
                        <span style="font-weight: 600;">$($sc.Name)</span>
                    </a>
"@
    }
    
    $html += @"
                </div>
            </div>
"@
}

$html += @"
        </div>
    </section>
"@

# INJECT INTO MARKETPLACE.HTML
$content = Get-Content -Path $file -Raw -Encoding UTF8

# Updated Regex to find the category block (Iterative, matches original OR already modified)
# Target: <!-- MARKETPLACE CATEGORIES --> ... <!-- VENDOR INFO -->

$pattern = '(?s)<!-- MARKETPLACE CATEGORIES -->.*?(?=<!-- VENDOR INFO -->)'

if ($content -notmatch $pattern) {
    # Fallback for original file state
    $pattern = '(?s)<section class="section">\s*<div class="container">\s*<h2 class="text-center mb-xl">Complete Category Catalog</h2>.*?</section>(?=<!-- VENDOR INFO -->)'
}

if ($content -match $pattern) {
    $replacement = "<!-- MARKETPLACE CATEGORIES -->`r`n" + $html
    $content = $content -replace $pattern, $replacement
    Set-Content -Path $file -Value $content -Encoding UTF8
    Write-Host "Marketplace layout updated successfully."
}
else {
    Write-Host "Pattern not found. Aborting."
}
