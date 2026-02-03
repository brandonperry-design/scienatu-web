
import os

# Configuration
directory = r'c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu'
chatbot_html = """  <!-- CHATBOT -->
  <div class="chatbot-container" id="chatbot-container">
    <div class="chatbot-header">
      <div class="chatbot-title">
        <span style="color: var(--patriot-red); font-weight: 800;">ScieNatu</span> Team
      </div>
      <button class="chatbot-close" id="chatbot-close" aria-label="Close chat"><i class="fas fa-times"></i></button>
    </div>
    <div class="chatbot-messages" id="chatbot-messages">
      <!-- Messages will appear here -->
      <div class="message bot-message">
        Hello! I'm Brandon. How can I help you today?
      </div>
    </div>
    <div class="chatbot-input-area">
      <input type="text" id="chatbot-input" placeholder="Type a message..." aria-label="Chat input">
      <button id="chatbot-send" aria-label="Send message"><i class="fas fa-paper-plane"></i></button>
    </div>
    <div class="chatbot-footer">
      <a href="tel:555-555-5555" class="chatbot-call-btn"><i class="fas fa-phone-alt"></i> Call Us Directly</a>
    </div>
  </div>

  <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat">
    <i class="fas fa-comment-dots"></i>
  </button>
"""

script_tag = '<script src="scripts.js"></script>'

def propagate_chatbot():
    print(f"Scanning directory: {directory}")
    files_updated = 0
    
    for filename in os.listdir(directory):
        if filename.endswith(".html") and filename != "index.html":
            filepath = os.path.join(directory, filename)
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check if chatbot already exists
            if 'id="chatbot-container"' in content:
                print(f"Skipping {filename} - Chatbot already present.")
                continue
                
            # Insertion point: before </body>
            if '</body>' in content:
                print(f"Updating {filename}...")
                
                # Check for scripts.js
                new_content = content
                if script_tag not in new_content:
                    # If scripts.js is missing, add it before body close, along with chatbot
                    replacement = f"{chatbot_html}\n  {script_tag}\n</body>"
                else:
                    # If scripts.js is present, just add chatbot before it? 
                    # Often script is at the very end. Let's just put chatbot before </body>
                    # and assume it will be above the script tag if the script tag is also near the end.
                    # Actually, to be safe, let's put it before <script src="scripts.js"> if it exists, 
                    # or before </body> if script is not there (handled above).
                    
                    if script_tag in content:
                         replacement = f"{chatbot_html}\n  {script_tag}\n</body>"
                         new_content = new_content.replace(f"{script_tag}\n</body>", replacement)
                         new_content = new_content.replace(f"{script_tag}</body>", replacement) # Handle minified/tight spacing
                         
                         # If strictly replace on tag didn't work (e.g. whitespace), fallback to body tag
                         if new_content == content:
                              replacement = f"{chatbot_html}\n</body>"
                              new_content = content.replace("</body>", replacement)
                    else:
                        replacement = f"{chatbot_html}\n</body>"
                        new_content = content.replace("</body>", replacement)

                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                files_updated += 1
            else:
                print(f"Skipping {filename} - No closing body tag found.")

    print(f"Propagation complete. Updated {files_updated} files.")

if __name__ == "__main__":
    propagate_chatbot()
