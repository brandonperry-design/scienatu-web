
$chatbotHtml = @"
  <!-- CHATBOT -->
  <div class="chatbot-container" id="chatbot-container">
    <div class="chatbot-header">
      <div class="chatbot-title">
        <span style="color: var(--patriot-red); font-weight: 800;">Scie</span><span style="color: var(--navy-blue); font-weight: 800;">Natu</span> <span style="color: #888; font-weight: 400;">Team</span>
      </div>
      <div class="chatbot-header-actions">
        <div class="chatbot-menu-container">
          <button class="chatbot-menu-toggle" id="chatbot-menu-toggle" aria-label="Chat menu">
            <i class="fas fa-ellipsis-v"></i>
          </button>
          <div class="chatbot-menu" id="chatbot-menu">
            <button id="chatbot-opt-survey">Begin Survey</button>
            <button id="chatbot-opt-resume">Resume Chat</button>
            <button id="chatbot-opt-reset">Close & Reset Chat</button>
          </div>
        </div>
        <button class="chatbot-close" id="chatbot-close" aria-label="Close chat"><i class="fas fa-times"></i></button>
      </div>
    </div>
    <div class="chatbot-messages" id="chatbot-messages">
      <!-- Messages will appear here -->
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
  <!-- /CHATBOT -->
"@

$scriptTag = '<script src="scripts.js"></script>'
$directory = "c:\Users\perry\OneDrive\Desktop\ScieNatu LLC\ScieNatu"

Get-ChildItem -Path $directory -Filter *.html | ForEach-Object {
  $content = Get-Content -Path $_.FullName -Raw -Encoding UTF8
    
  # If chatbot already exists, we replace the whole block (container + toggle)
  if ($content -match '(?s)<!-- CHATBOT -->.*?<button class="chatbot-toggle".*?>.*?</button>') {
    Write-Host "Updating existing chatbot on $($_.Name)..."
    $newContent = [regex]::Replace($content, '(?s)<!-- CHATBOT -->.*?<button class="chatbot-toggle".*?>.*?</button>', $chatbotHtml)
    Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8
  }
  elseif ($content -notmatch 'id="chatbot-container"') {
    Write-Host "Adding new chatbot to $($_.Name)..."
        
    # Check if script tag exists
    if ($content -match '<script src="scripts.js"></script>') {
      # If script tag exists, insert chatbot before it
      $newContent = $content.Replace('<script src="scripts.js"></script>', "$chatbotHtml`n  $scriptTag")
    }
    elseif ($content -match '</body>') {
      # If no script tag but body tag exists, insert both before body close
      $newContent = $content.Replace('</body>', "$chatbotHtml`n  $scriptTag`n</body>")
    }
    else {
      $newContent = $content + "`n$chatbotHtml`n$scriptTag"
    }
        
    Set-Content -Path $_.FullName -Value $newContent -Encoding UTF8
  }
  else {
    Write-Host "Skipping $($_.Name) - Unknown state."
  }
}

Write-Host "Propagation complete."
