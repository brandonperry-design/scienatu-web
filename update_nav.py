
import glob
import re
import os

files = glob.glob('C:/Users/perry/OneDrive/Desktop/SNGT/*.html')

new_nav_template = """<nav>
        <ul class="nav-menu">
          <li><a href="services.html" class="nav-link{0}">Services</a></li>
          <li><a href="gallery.html" class="nav-link{1}">Gallery</a></li>
          <li><a href="about.html" class="nav-link{2}">About</a></li>
          <li><a href="locations.html" class="nav-link{3}">Locations</a></li>
          <li><a href="financing.html" class="nav-link{4}">Financing</a></li>
          <li><a href="process.html" class="nav-link{5}">Our Process</a></li>
          <li><a href="schedule.html" class="nav-link{6}">Schedule Online</a></li>
          <li><a href="quote.html" class="btn btn-primary btn-sm{7}">GET A FREE QUOTE</a></li>
        </ul>
      </nav>"""

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Determine active page
    filename = os.path.basename(file_path)
    active_flags = [""] * 8
    
    if filename == 'services.html': active_flags[0] = " active"
    elif filename == 'gallery.html': active_flags[1] = " active"
    elif filename == 'about.html': active_flags[2] = " active"
    elif filename == 'locations.html': active_flags[3] = " active"
    elif filename == 'financing.html': active_flags[4] = " active"
    elif filename == 'process.html': active_flags[5] = " active"
    elif filename == 'schedule.html': active_flags[6] = " active"
    # Quote button usually doesn't have active state like links, but if on quote page maybe? 
    # The button class is separate. If on quote page, we can add a style or just leave it. 
    # The requirement is just the links. I'll leave quote button as is without 'active' class on btn 
    # unless it's the `<a>` tag getting it. Standard nav-link gets active. Button is btn.
    # It's fine.
    
    # Construct the specific nav for this file
    new_nav = new_nav_template.format(*active_flags)
    
    # Replace the existing nav block
    # Regex to find <nav>...</nav> inside the header or just the first <nav>
    # The file structure has one nav in header.
    
    updated_content = re.sub(r'<nav>\s*<ul class="nav-menu">.*?</ul>\s*</nav>', new_nav, content, flags=re.DOTALL)
    
    # Also update the tagline exclamation mark if missing
    updated_content = updated_content.replace('Building America\'s Future Today</div>', 'Building America\'s Future Today!</div>')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(updated_content)

    print(f"Updated {filename}")
