import os
import re

def get_header_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract Top Bar
    top_bar_match = re.search(r'(<!-- TOP BAR.*?<header)', content, re.DOTALL)
    if not top_bar_match:
        print("Could not find Top Bar in index.html")
        return None, None

    # We need to capture up to the end of the header
    # The pattern should go from <!-- TOP BAR ... up to </header>
    
    # Let's try to capture the exact blocks we want to verify structure
    # 1. Top Bar
    top_bar_pattern = r'(<!-- TOP BAR.*?</div>\s*</div>)'
    top_bar_match = re.search(top_bar_pattern, content, re.DOTALL)
    
    # 2. Header
    header_pattern = r'(<!-- HEADER & NAVIGATION.*?</header>)'
    header_match = re.search(header_pattern, content, re.DOTALL)

    if top_bar_match and header_match:
        return top_bar_match.group(1), header_match.group(1)
    else:
        print("Could not extract sections from index.html")
        return None, None

def update_files(directory, top_bar_content, header_content):
    count = 0
    for filename in os.listdir(directory):
        if filename.endswith(".html") and filename != "index.html":
            file_path = os.path.join(directory, filename)
            
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace Top Bar
            # We look for the existing top bar block
            # Pattern attempts to find <!-- TOP BAR ... </div></div> (closing div of top bar)
            # This is tricky without strict structure, but we can look for the same comment start
            
            new_content = content
            
            # Regex to replace Top Bar
            # Assume it starts with <!-- TOP BAR and ends before <!-- HEADER or <header
            # Actually, let's just replace the blocks if we can match them.
            
            # Replace Top Bar Logic
            # Find start of top bar and end of top bar (usually based on next comment or structure)
            # A safe way if they are consistent is to look for <!-- TOP BAR ... </div>\s*</div>
            
            top_bar_regex = r'<!-- TOP BAR.*?<div class="top-bar">.*?</div>\s*</div>'
            new_content = re.sub(top_bar_regex, top_bar_content, new_content, flags=re.DOTALL)
            
            # Replace Header Logic
            header_regex = r'<!-- HEADER & NAVIGATION.*?<header.*?</header>'
            new_content = re.sub(header_regex, header_content, new_content, flags=re.DOTALL)

            if new_content != content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {filename}")
                count += 1
            else:
                print(f"No changes matched for {filename} (might vary in structure)")
                
    print(f"Total files updated: {count}")

if __name__ == "__main__":
    target_dir = r"c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu"
    index_path = os.path.join(target_dir, "index.html")
    
    print(f"Reading from {index_path}...")
    top_bar, header = get_header_content(index_path)
    
    if top_bar and header:
        print("Successfully extracted header sections.")
        update_files(target_dir, top_bar, header)
    else:
        print("Aborting.")
