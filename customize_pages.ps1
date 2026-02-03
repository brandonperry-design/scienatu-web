
# DEFINITIONS

# Parent Category Mapping: Page -> List of Subcategories
$parents = @{
    "building-materials.html" = @(
        @{Name = "Lumber"; Link = "lumber.html"; Icon = "fa-tree" },
        @{Name = "Decking"; Link = "decking.html"; Icon = "fa-layer-group" },
        @{Name = "Fencing"; Link = "fencing.html"; Icon = "fa-bars" },
        @{Name = "Flooring"; Link = "flooring.html"; Icon = "fa-square" },
        @{Name = "Windows"; Link = "windows.html"; Icon = "fa-window-maximize" },
        @{Name = "Doors"; Link = "doors.html"; Icon = "fa-door-open" },
        @{Name = "Paint"; Link = "paint.html"; Icon = "fa-paint-roller" },
        @{Name = "Hardware"; Link = "hardware.html"; Icon = "fa-hammer" }
    )
    "tools-systems.html"      = @(
        @{Name = "Tools"; Link = "tools.html"; Icon = "fa-tools" },
        @{Name = "Outdoor Power"; Link = "outdoor-power.html"; Icon = "fa-cogs" },
        @{Name = "Electrical"; Link = "electrical.html"; Icon = "fa-bolt" },
        @{Name = "Heating & HVAC"; Link = "heating-hvac.html"; Icon = "fa-wind" }
    )
    "kitchen-bath.html"       = @(
        @{Name = "Kitchen"; Link = "kitchen.html"; Icon = "fa-utensils" },
        @{Name = "Bath"; Link = "bath.html"; Icon = "fa-bath" },
        @{Name = "Plumbing"; Link = "plumbing.html"; Icon = "fa-faucet" },
        @{Name = "Appliances"; Link = "appliances.html"; Icon = "fa-blender" },
        @{Name = "Lighting"; Link = "lighting.html"; Icon = "fa-lightbulb" }
    )
    "home-decor.html"         = @(
        @{Name = "Furniture"; Link = "furniture-home.html"; Icon = "fa-couch" },
        @{Name = "Window Treatments"; Link = "window-treatments.html"; Icon = "fa-columns" },
        @{Name = "Storage"; Link = "storage.html"; Icon = "fa-boxes" },
        @{Name = "Clothing"; Link = "clothing.html"; Icon = "fa-tshirt" }
    )
    "outdoor-living.html"     = @(
        @{Name = "Outdoors"; Link = "outdoors.html"; Icon = "fa-campground" },
        @{Name = "Patio Furniture"; Link = "patio-furniture.html"; Icon = "fa-chair" }
    )
    "marketplace.html"        = @( # Override marketplace to show groups? No, keep as is for now, or basic groups
    )
}

# Subcategory Products (Mock Data)
# Generic fallback if specific not defined
# NOTE: Dollar signs escaped with backtick (`$) to prevent PowerShell variable expansion
$defaultProducts = @(
    @{Name = "Premium Item A"; Desc = "High quality professional grade"; Price = "`$49.99" },
    @{Name = "Standard Item B"; Desc = "Reliable and durable"; Price = "`$29.99" },
    @{Name = "Pro Series X"; Desc = "Top of the line performance"; Price = "`$199.99" },
    @{Name = "Value Pack"; Desc = "Great for bulk projects"; Price = "`$89.99" }
)

$products = @{
    "lumber.html"     = @(
        @{Name = "2x4x8 Premium Stud"; Desc = "Kiln-dried heat treated spruce"; Price = "`$4.58" },
        @{Name = "1/2 in. Plywood"; Desc = "4ft x 8ft Sheathing"; Price = "`$28.95" },
        @{Name = "Pressure Treated 4x4"; Desc = "Ground contact rated"; Price = "`$12.48" },
        @{Name = "Oak Board 1x6"; Desc = "Premium Red Oak"; Price = "`$4.15/ft" }
    )
    "appliances.html" = @(
        @{Name = "Stainless French Door Fridge"; Desc = "28 cu. ft. Smart Refrigerator"; Price = "`$2,199.00" },
        @{Name = "Gas Range Pro"; Desc = "5-burner convection oven"; Price = "`$999.00" },
        @{Name = "High-Efficiency Washer"; Desc = "Front load with steam"; Price = "`$749.00" },
        @{Name = "Dishwasher Silent"; Desc = "42dBA ultra-quiet"; Price = "`$649.00" }
    )
    "tools.html"      = @(
        @{Name = "20V Cordless Drill"; Desc = "Brushless motor kit"; Price = "`$129.00" },
        @{Name = "Circular Saw"; Desc = "7-1/4 inch with laser guide"; Price = "`$89.00" },
        @{Name = "Mechanic Tool Set"; Desc = "200-piece socket set"; Price = "`$149.00" },
        @{Name = "Hammer Drill"; Desc = "Heavy duty masonry drill"; Price = "`$179.00" }
    )
    "lighting.html"   = @(
        @{Name = "Modern Chandelier"; Desc = "Brushed nickel 5-light"; Price = "`$189.00" },
        @{Name = "Recessed LED Kit"; Desc = "6-pack 6 inch dimmable"; Price = "`$59.99" },
        @{Name = "Smart Light Strip"; Desc = "RGB color changing Wi-Fi"; Price = "`$39.99" },
        @{Name = "Outdoor Floodlight"; Desc = "Motion sensor security"; Price = "`$79.00" }
    )
    "flooring.html"   = @(
        @{Name = "Luxury Vinyl Plank"; Desc = "Waterproof Heritage Oak"; Price = "`$3.29/sq ft" },
        @{Name = "Porcelain Tile"; Desc = "Marble look 12x24"; Price = "`$1.99/sq ft" },
        @{Name = "Solid Hardwood"; Desc = "Brazilian Cherry"; Price = "`$6.49/sq ft" },
        @{Name = "Laminate Flooring"; Desc = "Scratch resistant Hickory"; Price = "`$2.19/sq ft" }
    )
}

$directory = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu"

# FUNCTION: Generate Product Grid HTML
function Get-ProductGrid ($items) {
    if ($null -eq $items) { return "" }
    
    $html = @"
    <section class="section bg-offwhite">
        <div class="container">
            <h2 class="text-center mb-xl">Available Products</h2>
            <div class="grid grid-4">
"@
    
    foreach ($p in $items) {
        $html += @"
                <div class="card">
                    <div style="height: 200px; background: #ddd; display: flex; align-items: center; justify-content: center; color: #888;">
                        <i class="fas fa-box-open" style="font-size: 3rem;"></i>
                    </div>
                    <div class="card-content">
                        <h4>$($p.Name)</h4>
                        <p style="font-size: 0.9rem; color: #666;">$($p.Desc)</p>
                        <p style="font-weight: 700; color: var(--patriot-red); font-size: 1.25rem; margin-top: 1rem;">$($p.Price)</p>
                        <a href="cart.html" class="btn btn-sm btn-outline-blue" style="margin-top: 1rem; width: 100%; text-align: center;">Add to Cart</a>
                    </div>
                </div>
"@
    }
    
    $html += @"
            </div>
        </div>
    </section>
"@
    return $html
}

# FUNCTION: Generate Subcategory Grid HTML (For Parent Pages)
function Get-SubcatGrid ($subcats) {
    if ($null -eq $subcats) { return "" }
    
    $html = @"
    <section class="section">
        <div class="container">
            <h2 class="text-center mb-xl">Complete Category Catalog</h2>
            <div class="grid grid-3">
"@
    
    foreach ($sc in $subcats) {
        $html += @"
                <div class="card">
                    <div class="card-content" style="text-align: center;">
                        <i class="fas $($sc.Icon)" style="font-size: 3rem; color: var(--navy-blue); margin-bottom: 1rem;"></i>
                        <h3>$($sc.Name)</h3>
                        <a href="$($sc.Link)" class="btn btn-secondary">Shop $($sc.Name)</a>
                    </div>
                </div>
"@
    }
    
    $html += @"
            </div>
        </div>
    </section>
"@
    return $html
}


# PROCESS FILES
$allHtmlFiles = Get-ChildItem -Path $directory -Filter *.html

foreach ($file in $allHtmlFiles) {
    $name = $file.Name
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    $isParent = $parents.ContainsKey($name)
    $isProductPage = $products.ContainsKey($name)
    
    # Skip if index or other static pages (keeping generic list for logic simplicity, unless strictly product page)
    # We assume any page NOT in parents keys but IS in our category list is a product page
    # But for now, let's target specific ones we know.
    
    if (-not $isParent -and -not $isProductPage -and $name -ne "marketplace.html" -and $name -ne "index.html" -and $name -ne "sale.html") {
        # Treat as generic product page using default data
        $isProductPage = $true
    }

    if ($isParent) {
        Write-Host "Updating PARENT page: $name"
        $gridHtml = Get-SubcatGrid $parents[$name]
        
        # Replace the middle sections. 
        # Strategy: Find <!-- MARKETPLACE CATEGORIES --> ... <!-- FEATURED PRODUCTS --> (end of section)
        # We will strip out the generic categories and featured products blocks.
        
        # Regex to match from Categories start to Featured Products end
        # Pattern: <!-- MARKETPLACE CATEGORIES -->.*?<!-- VENDOR INFO -->
        # We replace it with our new grid + Vendor Info start
        
        $pattern = '(?s)<!-- MARKETPLACE CATEGORIES -->.*?(?=<!-- VENDOR INFO -->)'
        if ($content -match $pattern) {
            $content = $content -replace $pattern, $gridHtml
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        }
        
    }
    elseif ($isProductPage) {
        Write-Host "Updating PRODUCT page: $name"
        
        $prodList = $products[$name]
        if ($null -eq $prodList) { $prodList = $defaultProducts }
        
        $gridHtml = Get-ProductGrid $prodList
        
        $pattern = '(?s)<!-- MARKETPLACE CATEGORIES -->.*?(?=<!-- VENDOR INFO -->)'
        if ($content -match $pattern) {
            # Note: If reusing template, ensure this pattern still exists.
            # If we already ran it once, the pattern might be gone (replaced by "Complete Category Catalog" or "Available Products").
            # We should make the regex flexible to match potentially already modified content or the original.
            # Original: <!-- MARKETPLACE CATEGORIES -->
            # New check: If matches "Available Products" or "Complete Category Catalog", we might need to overwrite IT.
             
            $content = $content -replace $pattern, $gridHtml
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        }
        else {
            # Try matching the NEW pattern if we are re-running
            # Look for "<!-- MARKETPLACE CATEGORIES -->" which implies the start key is still there (our previous script kept it? No, we replaced the whole block.)
            # Wait, my previous script REPLACED "<!-- MARKETPLACE CATEGORIES -->". So the marker is GONE.
            # I need to restore the marker OR find a new anchor.
            # Ah, I replaced "<!-- MARKETPLACE CATEGORIES -->...<!-- VENDOR INFO -->" with "$gridHtml".
            # So the "<!-- MARKETPLACE CATEGORIES -->" comment is DELETED.
            # I should have kept the marker or used a broader regex.
             
            # Fallback: Look for <section ...> after hero?
            # Or regenerate the pages from scratch using `create_category_pages.ps1` first?
            # Regenerating is safer to ensure clean state.
             
            # Let's handle this in the outer logic from the agent: I will re-run create_Pages first? 
            # Or just adjust this script to target "<!-- MARKETPLACE HERO -->...<!-- VENDOR INFO -->" but that includes the hero.
            # Best bet: Target "<!-- MARKETPLACE HERO -->" ending </section> tag... tricky.
             
            # Actually, if I re-run `create_category_pages.ps1` it resets everything to the template `marketplace.html`.
            # That is the cleanest way to retry.
        }
    }
}
Write-Host "Customization script updated."
