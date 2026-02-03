
import os

# Configuration
directory = r'c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu'
template_file = os.path.join(directory, 'marketplace.html')

categories = {
    "Appliances": "appliances.html",
    "Bath": "bath.html",
    "Building Materials": "building-materials.html",
    "Clothing": "clothing.html",
    "Heating & HVAC": "heating-hvac.html",
    "Decking": "decking.html",
    "Doors": "doors.html",
    "Electrical": "electrical.html",
    "Fencing": "fencing.html",
    "Flooring": "flooring.html",
    "Hardware": "hardware.html",
    "Furniture & Home": "furniture-home.html",
    "Kitchen": "kitchen.html",
    "Lighting & Ceiling Fans": "lighting.html",
    "Lumber": "lumber.html",
    "Outdoors": "outdoors.html",
    "Outdoor Power Equipment": "outdoor-power.html",
    "Paint": "paint.html",
    "Patio Furniture": "patio-furniture.html",
    "Plumbing": "plumbing.html",
    "Storage & Organization": "storage.html",
    "Tools": "tools.html",
    "Windows": "windows.html",
    "Window Treatments": "window-treatments.html",
    "Sale Items": "sale.html"
}

def create_pages():
    print(f"Reading template: {template_file}")
    with open(template_file, 'r', encoding='utf-8') as f:
        template_content = f.read()

    # Locate Hero Section to Replace
    # Looking for: <h1 style="color: white; font-size: 3rem; margin-bottom: var(--space-md);">\n                        AECI <span style="color: var(--gold);">Marketplace</span>\n                    </h1>
    
    # We will do a generic replacement of the H1 block if possible, or build a regex.
    # The view_file showed:
    # <h1 style="color: white; font-size: 3rem; margin-bottom: var(--space-md);">
    #    AECI <span style="color: var(--gold);">Marketplace</span>
    # </h1>
    # <p style="color: white; font-size: 1.25rem;">Everything you need for your next project</p>

    for name, filename in categories.items():
        filepath = os.path.join(directory, filename)
        print(f"Creating {filename}...")
        
        new_content = template_content
        
        # Replace Title
        # We'll replace "AECI <span ...>Marketplace</span>" with specific name
        # Note: The span might vary, so let's try to target the inner HTML of H1 if we can't match exactly.
        # Simple string replace first.
        
        # Target 1: The Title
        old_title_part = 'AECI <span style="color: var(--gold);">Marketplace</span>'
        new_title_part = name
        
        if old_title_part in new_content:
             new_content = new_content.replace(old_title_part, new_title_part)
        else:
             # Fallback if exact string format differs (whitespace etc)
             # Try replacing just "Marketplace" if "AECI " is separate?
             pass

        # Target 2: The Subtitle
        old_subtitle = 'Everything you need for your next project'
        new_subtitle = f'Shop the best {name} deals'
        
        if old_subtitle in new_content:
            new_content = new_content.replace(old_subtitle, new_subtitle)
            
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

    print("Page creation complete.")

if __name__ == "__main__":
    create_pages()
