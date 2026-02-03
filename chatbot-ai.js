// ==========================================
// CHATBOT FUNCTIONALITY WITH GEMINI AI
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');
    const chatbotClose = document.getElementById('chatbot-close');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Phase 4: Menu Selectors
    const chatbotMenuToggle = document.getElementById('chatbot-menu-toggle');
    const chatbotMenu = document.getElementById('chatbot-menu');
    const chatbotOptSurvey = document.getElementById('chatbot-opt-survey');
    const chatbotOptResume = document.getElementById('chatbot-opt-resume');
    const chatbotOptReset = document.getElementById('chatbot-opt-reset');

    // Phase 6: Dynamically Add "My Projects" Menu Item
    let chatbotOptSaved = document.getElementById('chatbot-opt-saved');
    if (chatbotMenu && !chatbotOptSaved) {
        chatbotOptSaved = document.createElement('button');
        chatbotOptSaved.id = 'chatbot-opt-saved';
        chatbotOptSaved.innerHTML = '<i class="fas fa-folder-open"></i> My Projects';
        // Insert before Reset if possible
        if (chatbotOptReset) {
            chatbotMenu.insertBefore(chatbotOptSaved, chatbotOptReset);
        } else {
            chatbotMenu.appendChild(chatbotOptSaved);
        }
    }

    // Phase 6: Dynamically Add Voice Input (Mic)
    let micBtn = document.getElementById('chatbot-mic');
    if (chatbotInput && !micBtn) {
        micBtn = document.createElement('button');
        micBtn.id = 'chatbot-mic';
        micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        micBtn.style.cssText = 'background:none; border:none; color:#1a2b4b; font-size:1.1rem; cursor:pointer; margin-right:8px; display:flex; align-items:center;';
        chatbotInput.parentNode.insertBefore(micBtn, chatbotInput);
    }

    if (!chatbotToggle) return;

    // Configuration
    const BACKEND_URL = 'http://localhost:3000'; // Change this to your deployed backend URL
    let sessionId = localStorage.getItem('scienatu_chat_session') || null;
    // Load existing history if present
    let messageHistory = JSON.parse(localStorage.getItem('scienatu_chat_history')) || [];

    // Phase 5 cleanup: If history has the old greeting, force reset it to the new one
    const oldGreeting1 = "How can I help you with your AECI project today?";
    const oldGreeting2 = "How can I help you today?";
    if (messageHistory.length > 0 && messageHistory[0].role === 'assistant') {
        if (messageHistory[0].content.includes(oldGreeting1) || messageHistory[0].content.includes(oldGreeting2)) {
            messageHistory[0].content = "Hello! I'm Brandon, your ScieNatu assistant. How can I help you with your project today?";
            localStorage.setItem('scienatu_chat_history', JSON.stringify(messageHistory));
        }
    }

    if (messageHistory.length > 0) {
        messageHistory.forEach(msg => {
            renderMessage(msg.content, msg.role === 'user' ? 'user' : 'bot', true);
        });
        // Scroll to bottom after loading
        setTimeout(() => {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }, 100);
    }

    // Restore chat window state
    if (localStorage.getItem('scienatu_chat_active') === 'true') {
        chatbotContainer.classList.add('active');
    }

    // Toggle Chatbot
    function toggleChatbot() {
        chatbotContainer.classList.toggle('active');
        localStorage.setItem('scienatu_chat_active', chatbotContainer.classList.contains('active'));

        if (chatbotContainer.classList.contains('active')) {
            chatbotInput.focus();
            // Send greeting if first time
            if (messageHistory.length === 0) {
                sendInitialGreeting();
            }
        }
    }

    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotClose.addEventListener('click', toggleChatbot);

    // Phase 4: Menu Toggle & Options
    function toggleMenu() {
        chatbotMenu.classList.toggle('active');
    }

    function resetChat() {
        // Clear history and state
        localStorage.removeItem('scienatu_chat_history');
        localStorage.removeItem('scienatu_chat_session');
        messageHistory = [];
        sessionId = null;

        // UI Reset
        chatbotMessages.innerHTML = '';
        chatbotContainer.classList.remove('active');
        chatbotMenu.classList.remove('active');
        localStorage.setItem('scienatu_chat_active', 'false');
    }

    if (chatbotMenuToggle) {
        chatbotMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    if (chatbotOptSurvey) {
        chatbotOptSurvey.addEventListener('click', () => {
            window.open('support.html#survey', '_blank');
            toggleMenu();
        });
    }

    if (chatbotOptResume) {
        chatbotOptResume.addEventListener('click', () => {
            toggleMenu();
        });
    }

    if (chatbotOptReset) {
        chatbotOptReset.addEventListener('click', () => {
            if (confirm("This will clear your current chat history. Are you sure?")) {
                resetChat();
            }
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', () => {
        if (chatbotMenu && chatbotMenu.classList.contains('active')) {
            chatbotMenu.classList.remove('active');
        }
    });

    // Initial Greeting
    function sendInitialGreeting() {
        // Skip if there's already a message (e.g., on DIY Guide page or from history)
        if (chatbotMessages.children.length > 0) {
            return;
        }

        const msg = `Hello! I'm Brandon, your ScieNatu assistant. How can I help you with your project today?`;
        addMessage(msg, 'bot');
    }

    // Send Message to Backend
    async function sendMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        // Add User Message
        addMessage(text, 'user');
        chatbotInput.value = '';

        // Show Typing Indicator
        showTypingIndicator();

        try {
            // Call Backend API
            const response = await fetch(`${BACKEND_URL}/api/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: text,
                    sessionId: sessionId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response from server');
            }

            const data = await response.json();

            // Save session ID and update storage
            if (data.sessionId) {
                sessionId = data.sessionId;
                localStorage.setItem('scienatu_chat_session', sessionId);
            }

            // Remove typing indicator and show response
            removeTypingIndicator();
            addMessage(data.message, 'bot');

        } catch (error) {
            console.error('Error:', error);
            // Remove Typing Indicator
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) typingIndicator.remove();

            addMessage("I'm having trouble connecting right now. Please try again later.", 'bot');
        }
    }

    if (chatbotSend) {
        chatbotSend.addEventListener('click', sendMessage);
    }

    if (chatbotInput) {
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Phase 6: Voice Recognition Logic
    if (micBtn && ('webkitSpeechRecognition' in window)) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        micBtn.addEventListener('click', () => {
            if (micBtn.classList.contains('listening')) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        recognition.onstart = () => {
            micBtn.classList.add('listening');
            micBtn.style.color = '#e94560'; // Patriot Red
            chatbotInput.placeholder = "Listening...";
        };

        recognition.onend = () => {
            micBtn.classList.remove('listening');
            micBtn.style.color = '#1a2b4b'; // Navy Blue
            chatbotInput.placeholder = "Type a message...";
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatbotInput.value = transcript;
            // Optional: Auto-send
            // sendMessage(); 
            // kept manual send for review
            chatbotInput.focus();
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            micBtn.classList.remove('listening');
            micBtn.style.color = '#1a2b4b';
            chatbotInput.placeholder = "Type a message...";
        };
    }

    // Helper: Add message to UI and history
    function addMessage(text, side) {
        // Add to state and storage
        if (side !== 'loading') {
            messageHistory.push({ role: side === 'user' ? 'user' : 'assistant', content: text });
            localStorage.setItem('scienatu_chat_history', JSON.stringify(messageHistory));
        }

        // Render it
        renderMessage(text, side);
    }

    // Helper: Render message to UI
    function renderMessage(text, side, isLoadingHistory = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${side}-message`;

        // 0. Handle Images ![AltText](URL)
        let formattedText = text.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="chatbot-image">');

        // 1. Handle Links [Text](URL) - Clickable, Bold, No Underline
        formattedText = formattedText.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, url) => {
            const isHandoff = url.includes('quote.html') || url.includes('support.html');
            const className = isHandoff ? ' class="handoff-link"' : '';
            return `<a href="${url}"${className} target="_blank">${linkText}</a>`;
        });

        // 2. Handle Bold (**text**)
        formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // 3. Handle Bullet Points ( - Item) -> Transforming to Interactive Shopping List
        let hasItems = false;
        formattedText = formattedText.replace(/^- (.*)$/gm, (match, item) => {
            hasItems = true;
            return `<div class="shopping-item">
                      <input type="checkbox" class="shop-checkbox" checked>
                      <span class="shop-item-text">${item}</span>
                    </div>`;
        });

        // 4. Handle List Titles (Lines before lists) - Bold, Underlined, and Linked
        formattedText = formattedText.replace(/^([A-Z][^•\n<]{2,50})(?:\s*:)?\s*\n(?=[\-•\d])/gm, (match, title) => {
            const titleCased = title.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return `<a href="marketplace.html"><strong><u>${titleCased}</u></strong></a>\n`;
        });

        // 5. Handle All-Caps Keywords remaining in text (e.g., BUY NOW)
        formattedText = formattedText.replace(/(?<![">])\b([A-Z]{2,}(?:\s[A-Z]{2,})*)\b(?![<])/g, (match) => {
            const titleCased = match.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            return `<a href="marketplace.html">${titleCased}</a>`;
        });

        // 6. Handle Line Breaks
        formattedText = formattedText.split('\n').join('<br>');

        // 7. Final Clean up: Remove any remaining # or * or _ that might be cluttering the text
        formattedText = formattedText.replace(/[#*_]/g, '');

        messageDiv.innerHTML = formattedText;

        // If it's a bot message with items, add the "Add to Cart" button
        if (side === 'bot' && hasItems) {
            const btnGroup = document.createElement('div');
            btnGroup.className = 'chatbot-btn-group';

            const cartBtn = document.createElement('button');
            cartBtn.className = 'chatbot-action-btn cart-btn';
            cartBtn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
            cartBtn.onclick = () => addSelectedToCart(messageDiv);
            btnGroup.appendChild(cartBtn);

            // Check if there are prices to estimate
            if (formattedText.includes('$')) {
                const costBtn = document.createElement('button');
                costBtn.className = 'chatbot-action-btn cost-btn';
                costBtn.innerHTML = '<i class="fas fa-calculator"></i> Estimate Budget';
                costBtn.onclick = () => calculateProjectBudget(messageDiv);
                btnGroup.appendChild(costBtn);

                // Add Save Project Button (Phase 6)
                const saveBtn = document.createElement('button');
                saveBtn.className = 'chatbot-action-btn save-btn';
                saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Project';
                saveBtn.onclick = () => saveProjectForUser(messageDiv);
                saveBtn.onclick = () => saveProjectForUser(messageDiv);
                btnGroup.appendChild(saveBtn);

                // Add Export PDF Button (Phase 6)
                const pdfBtn = document.createElement('button');
                pdfBtn.className = 'chatbot-action-btn pdf-btn';
                pdfBtn.innerHTML = '<i class="fas fa-file-pdf"></i> Export PDF';
                pdfBtn.onclick = () => exportProjectToPDF(messageDiv);
                btnGroup.appendChild(pdfBtn);
            }

            messageDiv.appendChild(btnGroup);
        }

        chatbotMessages.appendChild(messageDiv);

        // Scroll logic (Smart Scroll)
        if (side === 'user') {
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        } else if (!isLoadingHistory) {
            setTimeout(() => {
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }
    }

    // Helper: Handle adding items to cart
    function addSelectedToCart(messageElement) {
        const selectedItems = [];
        const checkboxes = messageElement.querySelectorAll('.shop-checkbox:checked');

        checkboxes.forEach(cb => {
            const itemText = cb.nextElementSibling.innerText;
            selectedItems.push(itemText);
        });

        if (selectedItems.length === 0) {
            alert('Please select at least one item to add to your cart!');
            return;
        }

        // Simulate cart integration
        console.log('Adding to ScieNatu Cart:', selectedItems);

        // Show success state on button
        const cartBtn = messageElement.querySelector('.cart-btn');
        if (!cartBtn) return;

        const originalHtml = cartBtn.innerHTML;
        cartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
        cartBtn.style.background = '#28a745'; // Success green
        cartBtn.disabled = true;

        setTimeout(() => {
            cartBtn.innerHTML = originalHtml;
            cartBtn.style.background = ''; // Revert to CSS default
            cartBtn.disabled = false;
        }, 3000);
    }

    // Helper: Calculate Project Budget
    function calculateProjectBudget(messageElement) {
        const itemTexts = Array.from(messageElement.querySelectorAll('.shop-item-text')).map(el => el.innerText);
        let total = 0;
        let breakdownHtml = '<div class="budget-breakdown">';

        itemTexts.forEach(text => {
            const priceMatch = text.match(/\$(\d+(\.\d{2})?)/);
            if (priceMatch) {
                const price = parseFloat(priceMatch[1]);
                total += price;
                const itemName = text.split('($')[0].trim();
                breakdownHtml += `<div class="budget-row"><span>${itemName}</span><strong>$${price.toFixed(2)}</strong></div>`;
            }
        });

        breakdownHtml += `<hr><div class="budget-row total"><span>Estimated Total</span><strong>$${total.toFixed(2)}</strong></div></div>`;

        // Show result in a temporary overlay or message
        const budgetOverlay = document.createElement('div');
        budgetOverlay.className = 'budget-overlay';
        budgetOverlay.innerHTML = `
            <div class="budget-modal">
                <div class="budget-header">
                    <h3>Project Cost Estimate</h3>
                    <button class="close-budget">&times;</button>
                </div>
                ${breakdownHtml}
                <p class="budget-disclaimer">*Estimates based on marketplace averages. Prices may vary by exact specification.</p>
                <button class="budget-confirm-btn">Close Estimate</button>
            </div>
        `;

        document.body.appendChild(budgetOverlay);

        const closeBtn = budgetOverlay.querySelector('.close-budget');
        const confirmBtn = budgetOverlay.querySelector('.budget-confirm-btn');

        const removeOverlay = () => budgetOverlay.remove();
        closeBtn.onclick = removeOverlay;
        confirmBtn.onclick = removeOverlay;
        budgetOverlay.onclick = (e) => { if (e.target === budgetOverlay) removeOverlay(); };
    }

    // Helper: Save Project (Phase 6)
    function saveProjectForUser(messageElement) {
        const timestamp = new Date().toLocaleString();
        // Try to find a title, otherwise generic
        let title = "Saved Project " + timestamp;
        const potentialTitle = messageElement.querySelector('strong u');
        if (potentialTitle) title = potentialTitle.innerText;

        const projectData = {
            id: Date.now(),
            date: timestamp,
            title: title,
            html: messageElement.innerHTML
        };

        let projects = JSON.parse(localStorage.getItem('scienatu_saved_projects')) || [];
        projects.push(projectData);
        localStorage.setItem('scienatu_saved_projects', JSON.stringify(projects));

        const saveBtn = messageElement.querySelector('.save-btn');
        if (saveBtn) {
            const originalHtml = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved!';
            saveBtn.style.color = '#28a745';
            setTimeout(() => {
                saveBtn.innerHTML = originalHtml;
                saveBtn.style.color = '';
            }, 2000);
        }
    }

    // Helper: Show Saved Projects
    function showSavedProjects() {
        const projects = JSON.parse(localStorage.getItem('scienatu_saved_projects')) || [];

        let content = '';
        if (projects.length === 0) {
            content = '<p>You have no saved projects yet.</p>';
        } else {
            content = '<div class="saved-projects-list">';
            projects.forEach(p => {
                content += `
                <div class="saved-project-card">
                    <h4><i class="fas fa-clipboard-list"></i> ${p.title}</h4>
                    <span class="project-date">${p.date}</span>
                    <button class="load-project-btn" data-id="${p.id}">View Plan</button>
                    <button class="delete-project-btn" data-id="${p.id}">&times;</button>
                </div>`;
            });
            content += '</div>';
        }

        addMessage(`<h3>📂 My Saved Projects</h3>${content}`, 'bot');

        // Add listeners for dynamic buttons
        setTimeout(() => {
            document.querySelectorAll('.load-project-btn').forEach(btn => {
                btn.onclick = (e) => {
                    const pid = parseInt(e.target.dataset.id);
                    const proj = projects.find(p => p.id === pid);
                    if (proj) {
                        const msgDiv = document.createElement('div');
                        msgDiv.className = 'message bot-message';
                        msgDiv.innerHTML = `<h3>re: ${proj.title}</h3>` + proj.html;
                        // Remove buttons from the re-rendered historical view to avoid confusion
                        const buttons = msgDiv.querySelector('.chatbot-btn-group');
                        if (buttons) buttons.remove();
                        chatbotMessages.appendChild(msgDiv);
                        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
                    }
                };
            });

            document.querySelectorAll('.delete-project-btn').forEach(btn => {
                btn.onclick = (e) => {
                    if (confirm('Delete this project?')) {
                        const pid = parseInt(e.target.dataset.id);
                        const newProjects = projects.filter(p => p.id !== pid);
                        localStorage.setItem('scienatu_saved_projects', JSON.stringify(newProjects));
                        e.target.parentElement.remove();
                    }
                };
            });
        }, 500);
    }

    // Helper: Export to PDF (Phase 6)
    function exportProjectToPDF(messageElement) {
        const content = messageElement.innerHTML;
        // Clean up buttons from content
        const cleanContent = content.replace(/<div class="chatbot-btn-group">.*?<\/div>/s, '');

        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>ScieNatu Project Plan</title>');
        printWindow.document.write(`
            <style>
                body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                h1 { color: #0a192f; border-bottom: 2px solid #e94560; padding-bottom: 10px; }
                strong { color: #0a192f; }
                ul { margin-bottom: 20px; }
                li { margin-bottom: 5px; }
                .shopping-item { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
                input[type="checkbox"] { transform: scale(1.2); }
                .footer { margin-top: 50px; font-size: 0.8rem; color: #888; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
        `);
        printWindow.document.write('</head><body>');
        printWindow.document.write('<h1>Project Plan</h1>');
        printWindow.document.write(cleanContent);
        printWindow.document.write('<div class="footer">Generated by ScieNatu Assistant | www.scienatu.com</div>');
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    }

    // Helper: Typing Indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
        chatbotMessages.appendChild(typingDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
    }
});
