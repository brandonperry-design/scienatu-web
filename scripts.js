/* ==========================================
   ScieNatu Global Technologies - Main JavaScript
   ========================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
  initHeroSlideshow();
  initMobileMenu();
  initSmoothScroll();
  initFormValidation();
  initSearchFunctionality();

  // Re-trigger slideshow start to be safe
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const event = new Event('mouseleave');
    heroSection.dispatchEvent(event);
  }
});

/* ==========================================
   HERO SLIDESHOW
   ========================================== */
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const indicators = document.querySelectorAll('.hero-indicator');

  if (slides.length <= 1) return;

  let currentSlide = 0;
  const slideInterval = 2500; // 2.5 seconds
  let slideTimer;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));

    currentSlide = index;
    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add('active');
    }
  }

  function startAutoSlide() {
    stopAutoSlide();
    slideTimer = setInterval(() => {
      let next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }, slideInterval);
  }

  function stopAutoSlide() {
    if (slideTimer) clearInterval(slideTimer);
  }

  // Manual controls
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', function () {
      showSlide(index);
      startAutoSlide();
    });
  });

  // Pause on hover
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
  }

  // Initialize
  showSlide(0);
  startAutoSlide();
}

/* ==========================================
   MOBILE MENU
   ========================================== */
function initMobileMenu() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', function () {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (event) {
    if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
      navMenu.classList.remove('active');
      menuToggle.classList.remove('active');
    }
  });
}

/* ==========================================
   SMOOTH SCROLLING
   ========================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);

      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================
   FORM VALIDATION
   ========================================== */
function initFormValidation() {
  const forms = document.querySelectorAll('form:not(.search-form)');

  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll('[required]');

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'var(--patriot-red)';
        } else {
          input.style.borderColor = '';
        }
      });

      // Email validation
      const emailInputs = form.querySelectorAll('input[type="email"]');
      emailInputs.forEach(input => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (input.value && !emailPattern.test(input.value)) {
          isValid = false;
          input.style.borderColor = 'var(--patriot-red)';
        }
      });

      // Phone validation
      const phoneInputs = form.querySelectorAll('input[type="tel"]');
      phoneInputs.forEach(input => {
        const phonePattern = /^[\d\s\-\(\)]+$/;
        if (input.value && !phonePattern.test(input.value)) {
          isValid = false;
          input.style.borderColor = 'var(--patriot-red)';
        }
      });

      if (isValid) {
        // Show success message
        alert('Thank you! Your submission has been received. We\'ll contact you soon.');
        form.reset();
      } else {
        alert('Please fill in all required fields correctly.');
      }
    });
  });
}

/* ==========================================
   SEARCH FUNCTIONALITY
   ========================================== */
/* ==========================================
   SEARCH FUNCTIONALITY (AutoComplete & Fuzzy)
   ========================================== */
const siteSearchData = [
  // MAIN PAGES
  { title: "Home", url: "index.html", keywords: "home main hero architecture engineering construction" },
  { title: "Marketplace", url: "marketplace.html", keywords: "shop store buy materials lumber tools appliances decor" },
  { title: "Services", url: "services.html", keywords: "services residential commercial industrial contracting" },
  { title: "Locations", url: "locations.html", keywords: "locations map find office contact states regions" },
  { title: "About Us", url: "about.html", keywords: "company mission vision team history who we are" },
  { title: "Contact", url: "contact.html", keywords: "contact email phone support help reach out" },
  { title: "Vendor Portal", url: "vendor.html", keywords: "vendor sell supplier partner application business apply" },

  // BUILDING MATERIALS
  { title: "Building Materials", url: "building-materials.html", keywords: "building construction supplies materials" },
  { title: "Lumber", url: "lumber.html", keywords: "lumber wood timber board plank stud plywood framing pressure treated" },
  { title: "Decking", url: "decking.html", keywords: "decking deck composite wood outdoor patio boards" },
  { title: "Fencing", url: "fencing.html", keywords: "fencing fence vinyl wood metal privacy post" },
  { title: "Flooring", url: "flooring.html", keywords: "flooring floor tile laminate hardwood carpet plank" },
  { title: "Windows", url: "windows.html", keywords: "windows window glass double pane energy star vinyl" },
  { title: "Doors", url: "doors.html", keywords: "doors door entry interior exterior patio hardware knob" },
  { title: "Paint", url: "paint.html", keywords: "paint primer stain brush roller interior exterior color" },
  { title: "Hardware", url: "hardware.html", keywords: "hardware fastener screw nail bolt nut anchor hinge" },

  // TOOLS & SYSTEMS
  { title: "Tools & Systems", url: "tools-systems.html", keywords: "tools power equipment systems machinery" },
  { title: "Hand & Power Tools", url: "tools.html", keywords: "tools drill saw sander hammer screwdriver wrench power kit" },
  { title: "Outdoor Power Equipment", url: "outdoor-power.html", keywords: "outdoor power mower trimmer blower chainsaw snow" },
  { title: "Electrical", url: "electrical.html", keywords: "electrical wire breaker outlet switch light conduit panel" },
  { title: "Heating & HVAC", url: "heating-hvac.html", keywords: "hvac heating cooling ac air conditioner furnace thermostat vent" },

  // KITCHEN & BATH
  { title: "Kitchen & Bath", url: "kitchen-bath.html", keywords: "kitchen bath bathroom remodel renovation" },
  { title: "Kitchen", url: "kitchen.html", keywords: "kitchen cabinet sink faucet countertop island" },
  { title: "Bath", url: "bath.html", keywords: "bath bathroom tub shower toilet vanity mirror" },
  { title: "Plumbing", url: "plumbing.html", keywords: "plumbing pipe fitting valve pex copper drainage heater" },
  { title: "Appliances", url: "appliances.html", keywords: "appliances refrigerator fridge stove oven dishwasher washer dryer" },
  { title: "Lighting & Fans", url: "lighting.html", keywords: "lighting light fixture ceiling fan chandelier led lamp" },

  // HOME & DECOR
  { title: "Home & Decor", url: "home-decor.html", keywords: "home decor decoration furniture interior" },
  { title: "Furniture", url: "furniture-home.html", keywords: "furniture sofa chair table desk bed dining room living" },
  { title: "Window Treatments", url: "window-treatments.html", keywords: "window treatments blinds shades curtains drapes shutters" },
  { title: "Storage", url: "storage.html", keywords: "storage organization shelf shelving bin box closet garage" },
  { title: "Clothing & Workwear", url: "clothing.html", keywords: "clothing workwear boot shoe glove safety hat jacket vest" },

  // OUTDOOR LIVING
  { title: "Outdoor Living", url: "outdoor-living.html", keywords: "outdoor living backyard garden patio" },
  { title: "Outdoors", url: "outdoors.html", keywords: "outdoors garden lawn plant soil landscaping tool grill" },
  { title: "Patio Furniture", url: "patio-furniture.html", keywords: "patio furniture set chair table umbrella cushion outdoor" },

  // SPECIALTY PAGES
  { title: "Bulk Deals", url: "bulk-deals.html", keywords: "bulk deal volume discount wholesale pallet bundle save" },
  { title: "Deck Starter Kit", url: "kit-deck.html", keywords: "deck kit weekend warrior bundle diy package starter" },
  { title: "Security Starter Kit", url: "kit-security.html", keywords: "security kit smart home camera doorbell lock protection bundle" },
  { title: "Garden Starter Kit", url: "kit-garden.html", keywords: "garden kit spring prep planter soil seed tool bundle" },
  { title: "Daily Deals", url: "deals.html", keywords: "deals sale clearance discount offer today" },
  { title: "Sale Items", url: "sale.html", keywords: "sale bargain cheap closeout price drop" },
  { title: "Services - Residential", url: "services_residential.html", keywords: "home house remodel repair kitchen bath" },
  { title: "Services - Commercial", url: "services_commercial.html", keywords: "business office retail building facility" },
  { title: "Services - Industrial", url: "services_industrial.html", keywords: "factory plant manufacturing warehouse" }
];

function initSearchFunctionality() {
  const searchForms = document.querySelectorAll('.search-form');
  if (searchForms.length === 0) return;

  searchForms.forEach(searchForm => {
    const searchInput = searchForm.querySelector('.search-input');
    if (!searchInput) return;

    // Create dropdown container
    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    dropdown.style.cssText = `
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      background: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      border-radius: 4px;
      z-index: 1000;
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #eee;
    `;
    searchForm.style.position = 'relative'; // Ensure relative positioning for dropdown
    searchForm.style.zIndex = '2001'; // Ensure it sits above the sticky header (z-index 1000)

    // Disable browser autocomplete to prevent it from covering our custom dropdown
    searchInput.setAttribute('autocomplete', 'off');

    searchForm.appendChild(dropdown);

    // Levenshtein Distance for Fuzzy Search
    const levenshtein = (a, b) => {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
      for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) == a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1));
          }
        }
      }
      return matrix[b.length][a.length];
    };

    const getScore = (item, query) => {
      const text = (item.title + " " + item.keywords).toLowerCase();
      const q = query.toLowerCase();

      // Direct match bonus
      if (text.includes(q)) return 0;

      // Fuzzy match
      const words = text.split(" ");
      let minDist = 100;
      words.forEach(w => {
        const dist = levenshtein(w, q);
        if (dist < minDist) minDist = dist;
      });

      return minDist;
    };

    searchInput.addEventListener('input', function () {
      const query = this.value.trim();

      if (query.length < 2) {
        dropdown.style.display = 'none';
        return;
      }

      // Filter and Sort based on score (lower score is better)
      const results = siteSearchData
        .map(item => ({ ...item, score: getScore(item, query) }))
        .filter(item => item.score < 3) // Tolerance threshold (e.g., allow 2 typos)
        .sort((a, b) => a.score - b.score)
        .slice(0, 5); // Take top 5

      if (results.length > 0) {
        dropdown.innerHTML = results.map(item => `
          <a href="${item.url}" class="search-result-item" style="
            display: block;
            padding: 10px 15px;
            text-decoration: none;
            color: #333;
            border-bottom: 1px solid #f0f0f0;
            transition: background 0.2s;
          " onmouseover="this.style.background='#f9f9f9'" onmouseout="this.style.background='white'">
            <div style="font-weight: 600; font-size: 0.9em; color: var(--navy-blue);">${item.title}</div>
            <div style="font-size: 0.8em; color: #666;">${item.score === 0 ? 'Match' : 'Did you mean?'}</div>
          </a>
        `).join('');
        // Add 'View all results' link
        dropdown.innerHTML += `
          <a href="search.html?q=${encodeURIComponent(query)}" style="
            display: block;
            padding: 8px;
            text-align: center;
            background: #f8f9fa;
            color: var(--patriot-red);
            font-weight: 600;
            font-size: 0.85em;
            text-decoration: none;
          ">View all results for "${query}"</a>
        `;
        dropdown.style.display = 'block';
      } else {
        dropdown.style.display = 'none';
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!searchForm.contains(e.target)) {
        dropdown.style.display = 'none';
      }
    });
  });
}

/* ==========================================
   GALLERY FILTERING
   ========================================== */
function initGalleryFiltering() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterButtons.length === 0 || galleryItems.length === 0) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      // Filter items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 10);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================
   ANIMATED COUNTERS (for stats)
   ========================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  };

  // Intersection Observer for triggering animation when in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

/* ==========================================
   ACTIVE NAV LINK
   ========================================== */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// Initialize active nav link
setActiveNavLink();

// Initialize gallery filtering if on gallery page
if (document.querySelector('.gallery-grid')) {
  initGalleryFiltering();
}

// Initialize animated counters if stats are present
if (document.querySelector('.stat-number')) {
  initAnimatedCounters();
}


// ==========================================
// OLD CHATBOT FUNCTIONALITY - DISABLED
// ==========================================
// This old chatbot code has been commented out to prevent conflicts
// with the new AI-powered chatbot in chatbot-ai.js
//
// The new AI chatbot uses Google Gemini API for intelligent responses
// See chatbot-ai.js for the active chatbot code
// ==========================================

/* OLD CHATBOT CODE - COMMENTED OUT
document.addEventListener('DOMContentLoaded', function () {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');

  if (!chatbotToggle) return;

  // Toggle Chatbot
  function toggleChatbot() {
    chatbotContainer.classList.toggle('active');
    if (chatbotContainer.classList.contains('active')) {
      chatbotInput.focus();
      // Send greeting if empty
      if (chatbotMessages.children.length === 0) {
        sendTimeAwareGreeting();
      }
    }
  }

  chatbotToggle.addEventListener('click', toggleChatbot);
  chatbotClose.addEventListener('click', toggleChatbot);

  // Time Aware Greeting
  function sendTimeAwareGreeting() {
    const hour = new Date().getHours();
    let greeting = "Hello";
    if (hour < 12) greeting = "Good Morning";
    else if (hour < 18) greeting = "Good Afternoon";
    else greeting = "Good Evening";

    // Add initial bot message with quick replies
    const msg = `${greeting}! I'm Brandon. I can help with <b>Tools</b>, <b>Building Materials</b>, <b>Decor</b>, and more. How can I assist you?`;
    addMessage(msg, 'bot');
    addQuickReplies(['Check Deals', 'Browse Products', 'Track Order', 'Start Selling']);
  }

  // Send Message Logic
  function sendMessage() {
    const text = chatbotInput.value.trim();
    if (!text) return;

    // Add User Message
    addMessage(text, 'user');
    chatbotInput.value = '';

    // Remove old quick replies
    removeQuickReplies();

    // Show Typing Indicator
    showTypingIndicator();

    // Simulate AI Response Time (randomized slightly)
    const delay = Math.random() * 500 + 1000; // 1-1.5s
    setTimeout(() => {
      removeTypingIndicator();
      const response = getAIResponse(text);
      addMessage(response.text, 'bot');
      if (response.replies) {
        addQuickReplies(response.replies);
      }
    }, delay);
  }

  chatbotSend.addEventListener('click', sendMessage);
  chatbotInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
  });

  // Helper: Add Message
  function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', `${sender}-message`);
    msgDiv.innerHTML = text;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
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

  // Helper: Quick Replies
  function addQuickReplies(options) {
    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'quick-replies';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = opt;
      btn.onclick = () => {
        chatbotInput.value = opt;
        sendMessage();
      };
      repliesDiv.appendChild(btn);
    });
    chatbotMessages.appendChild(repliesDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function removeQuickReplies() {
    const existing = document.querySelectorAll('.quick-replies');
    existing.forEach(el => el.remove());
  }

  // ---------------------------------------------------------
  // AI BRAIN (Full Product Catalog Integration)
  // ---------------------------------------------------------
  function getAIResponse(text) {
    const lower = text.toLowerCase();

    // [REST OF OLD CHATBOT CODE - ALL COMMENTED OUT]
    // ... approximately 200 more lines ...
  }

  // [ALL DIY CONSULTATION ENGINE CODE - COMMENTED OUT]
});
END OF OLD CHATBOT CODE */
