
$categories = @{
    "Appliances"              = "appliances.html"
    "Bath"                    = "bath.html"
    "Building Materials"      = "building-materials.html"
    "Clothing"                = "clothing.html"
    "Heating & HVAC"          = "heating-hvac.html"
    "Decking"                 = "decking.html"
    "Doors"                   = "doors.html"
    "Electrical"              = "electrical.html"
    "Fencing"                 = "fencing.html"
    "Flooring"                = "flooring.html"
    "Hardware"                = "hardware.html"
    "Furniture & Home"        = "furniture-home.html"
    "Kitchen"                 = "kitchen.html"
    "Lighting & Ceiling Fans" = "lighting.html"
    "Lumber"                  = "lumber.html"
    "Outdoors"                = "outdoors.html"
    "Outdoor Power Equipment" = "outdoor-power.html"
    "Paint"                   = "paint.html"
    "Patio Furniture"         = "patio-furniture.html"
    "Plumbing"                = "plumbing.html"
    "Storage & Organization"  = "storage.html"
    "Tools"                   = "tools.html"
    "Tools & Systems"         = "tools-systems.html"
    "Kitchen & Bath"          = "kitchen-bath.html"
    "Home & Decor"            = "home-decor.html"
    "Outdoor Living"          = "outdoor-living.html"
    "Windows"                 = "windows.html"
    "Window Treatments"       = "window-treatments.html"
    "Sale Items"              = "sale.html"
}

$templatePath = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu\page_template.html"

foreach ($name in $categories.Keys) {
    $filename = $categories[$name]
    $filepath = Join-Path -Path $directory -ChildPath $filename
    
    Write-Host "Creating $filename..."
    
    $newContent = $templateContent
    
    # Simple replace for title and subtitle
    # Use generic replacement if specific string match fails
    $newContent = $newContent.Replace('AECI <span style="color: var(--gold);">Marketplace</span>', $name)
    $newContent = $newContent.Replace('Everything you need for your next project', "Shop the best $name deals")
    
    Set-Content -Path $filepath -Value $newContent -Encoding UTF8
}

Write-Host "Page creation complete."
