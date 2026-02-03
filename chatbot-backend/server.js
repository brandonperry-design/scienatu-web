const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Serve static files from the root directory
app.use(express.static(path.join(__dirname, '../')));

// Initialize Gemini AI (Moved to route handler for safety)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// STORE CONVERSATION HISTORIES
const conversations = new Map();

// PRODUCT LINK MAP
const PRODUCT_LINKS = "\\n- Lumber: lumber.html\\n- Decking: decking.html\\n- Building Materials: building-materials.html\\n- Tools: tools.html\\n- Hardware: hardware.html\\n- Paint: paint.html\\n- Flooring: flooring.html\\n- Plumbing: plumbing.html\\n- Electrical: electrical.html\\n- Deck Kits: kit-deck.html\\n- Garden Kits: kit-garden.html\\n- Kitchen: kitchen.html\\n- Bath: bath.html\\n- Appliances: appliances.html\\n- Lighting: lighting.html\\n- Fencing: fencing.html\\n- Outdoor Living: outdoor-living.html\\n- Marketplace: marketplace.html\\n";
// VISUAL INSPIRATION MAP
const PRODUCT_IMAGES = "\\n- Deck: designer_kitchen_inspiration_1770072370538.png\\n- Kitchen: designer_kitchen_inspiration_1770072370538.png\\n- Warehouse: industrial_warehouse_inspiration_1770072383338.png\\n- Patio: modern_deck_inspiration_1770072358780.png\\n";

// PHASE 5 SYSTEM PROMPT - Product-First AECI Consultant
const SYSTEM_PROMPT = [
    "You are Brandon, ScieNatu's expert AECI product consultant.",
    "Your goal is to help users select and procure the right products for any project.",
    "ScieNatu is a product - based company—we specialize in supplying world - class materials and tools.",
    "",
    "### RESPONSE CORE RULES:",
    "1. ** NO RE - INTRODUCTION **: Do NOT reintroduce yourself(e.g., do not say 'I'm Brandon' or 'As an assistant').",
    "2. ** NO FLUFF GREETINGS **: Do not start responses with 'Hello,' 'Hi,' or 'Sure thing.' Jump straight to the information or solution.",
    "3. ** DIRECT & EFFICIENT **: Solve the user's problem immediately.",
    "",
    "### RESPONSE STYLE:",
    "1. ** NO MARKDOWN SYMBOLS **: Do NOT use characters like #, *, or _ for formatting. ",
    "2. ** CLEAN STRUCTURE **: Use simple line breaks and Title Case for headings. ** ALWAYS provide a clear heading(e.g., 'Materials Needed:') immediately followed by a newline before every list.**",
    "    3. ** THINGS NEEDED **: List materials or tools using simple dashes (-) for bullet points. ** For each material, include an estimated unit price in parentheses(e.g., '- Pressure Treated Post ($25.00 each)').**",
    "        4. ** PROJECT STEPS **: List instruction steps using numbers (1., 2., 3., etc.).",
    "5. ** PRODUCT LINKS **: Embed links to ScieNatu's categories.",
    "    - Format: [Product Name](link.html)",
    "    - Categories: " + PRODUCT_LINKS,
    "6. ** VISUAL INSPIRATION **: If the project matches a key visual(Deck, Kitchen, Warehouse), embed an image at the start.",
    "   - Format: ![Visual](image_url)",
    "    - Local Images: " + PRODUCT_IMAGES,
    "7. ** PROACTIVE FOLLOW - UP **: Always end your response with a helpful follow - up question.",
    "",
    "### TECHNICAL ASSESSMENT(PRO MODE):",
    "If the user mentions 'specs', 'commercial', 'BOM', or 'industrial':",
    "1. ** ACKNOWLEDGE **: Confirm this is a technical request.",
    "2. ** ASK **: Ask 3 specific questions:",
    "- 'What is the load-bearing requirement?'",
    "    - 'Do you have the specific dimensions/blueprint?'",
    "    - 'Is this for a commercial or residential application?'",
    "3. ** OFFER SUPPORT **: Mention that our Engineering Support team can review their BOM.",
    "",
    "### PRODUCT SCALE & PROCUREMENT(PHASE 3):",
    "1. ** IDENTIFY PROJECT SCALE **: Determine if the user is a DIYer, contractor, or industrial procurement officer.",
    "2. ** BULK QUOTES **: If a project is large(e.g., 'full house build', 'commercial warehouse', 'bulk lumber order'), suggest our bulk quote system.",
    "   - Recommendation: 'For large-scale AECI projects, we offer competitive bulk pricing on materials. [Request a Bulk Product Quote](contact.html)'",
    "3. ** AECI SPECIALIZATION **: If the user needs specific industrial or residential specs, guide them to our technical support team for product fulfillment.",
    "   - Recommendation: 'Our specialists can help verify project specs for your order. [Contact Product Support](support.html)'",
    "",
    "Keep it helpful, professional, and focused on ScieNatu's product catalog."
].join("\\n");

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Chatbot server is online!' });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        if (!message) return res.status(400).json({ error: 'No message provided' });

        const sid = sessionId || Date.now().toString();
        let history = conversations.get(sid) || [];

        // Build context
        const historyText = history.map(h => (h.role === 'user' ? 'User' : 'Assistant') + ': ' + h.content + ' ').join('\\n\\n');

        const apiKey = (process.env.GEMINI_API_KEY || '').trim();
        const genAI = new GoogleGenerativeAI(apiKey);

        const models = ['gemini-pro-latest', 'gemini-flash-latest', 'gemini-2.0-flash'];
        let aiResponse = null;

        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const fullPrompt = SYSTEM_PROMPT + ' \\n\\n' + historyText + ' \\n\\nUser: ' + message + ' \\nAssistant: ';

                const result = await model.generateContent(fullPrompt);
                aiResponse = result.response.text();

                if (aiResponse) break;
            } catch (err) {
                console.log('FAILED(' + modelName + '): ' + err.message + ' ');
                console.log(JSON.stringify(err, null, 2));
            }
        }

        if (!aiResponse) throw new Error('AI failed to respond');

        // Save history
        history.push({ role: 'user', content: message });
        history.push({ role: 'assistant', content: aiResponse });
        conversations.set(sid, history);

        // LEAD LOGGING (PHASE 3)
        const fs = require('fs');
        const path = require('path');
        const leadsPath = path.join(__dirname, 'project-leads.log');

        const timestamp = new Date().toISOString();
        if (message.length > 5 && (message.toLowerCase().includes('build') || message.toLowerCase().includes('plan') || message.toLowerCase().includes('need'))) {
            const entry = '[' + timestamp + ']Session: ' + sid + ' | Lead: ' + message.substring(0, 50) + '...\\n';
            fs.appendFileSync(leadsPath, entry);
        }

        res.json({ message: aiResponse, sessionId: sid });

    } catch (error) {
        console.error('SERVER ERROR:', error.message);
        res.status(500).json({ error: 'AI Error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log('🚀 ScieNatu Chatbot Backend - Refined Persona RUNNING!');
});
