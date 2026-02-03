# ScieNatu AI Chatbot - Setup Guide

## 🎉 100% FREE AI-Powered Chatbot

This chatbot uses Google Gemini 1.5 Flash API (completely FREE) to provide intelligent DIY project assistance to your customers.

---

## Quick Start (5 Minutes)

### Step 1: Get Your Free Gemini API Key

1. Go to [Google AI Studio](https://ai.google.dev)
2. Click "Get API Key"
3. Sign in with your Google account
4. Click "Create API Key"
5. Copy your API key

**No credit card required!** ✅

###Step 2: Install Dependencies

Open a terminal in the `chatbot-backend` folder and run:

```bash
cd chatbot-backend
npm install
```

This will install:
- `express` - Web server
- `@google/generative-ai` - Gemini AI SDK
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Step 3: Configure API Key

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
   ```

### Step 4: Start the Backend Server

```bash
npm start
```

You should see:
```
🚀 Chatbot backend server running on port 3000
💬 Chat endpoint: http://localhost:3000/api/chat
❤️  Health check: http://localhost:3000/health
```

### Step 5: Update Your HTML Files

Add the new AI chatbot script to ALL your HTML pages. Find this line near the end of each file:

```html
<script src="scripts.js"></script>
```

Add the new script AFTER it:

```html
<script src="scripts.js"></script>
<script src="chatbot-ai.js"></script>
```

### Step 6: Test It!

1. Open any HTML page (e.g., `index.html`)
2. Click the chatbot button (bottom right)
3. Ask: "I want to build a deck"
4. Watch the AI respond intelligently!

---

## How It Works

### Architecture

```
User Browser                Backend Server           Google Gemini
    │                            │                         │
    ├─ Types message             │                         │
    ├─────────────────────────►  │                         │
    │  POST /api/chat             │                         │
    │                             ├──────────────────────► │
    │                             │  Generate response      │
    │                             │ ◄──────────────────────┤
    │ ◄──────────────────────────┤                         │
    │  AI Response                │                │
    └─ Displays message           │                         │
```

### What The AI Can Do

✅ Answer DIY project questions
✅ Ask clarifying questions about projects
✅ Provide step-by-step instructions
✅ Create materials lists
✅ Recommend ScieNatu products
✅ Offer safety tips
✅ Remember conversation context

### Example Conversations

```
User: "I want to paint my living room"

AI: "Great! I'd be happy to help you plan your living room painting project.

Let me ask a few questions to give you the best advice:

1. What is the approximate square footage of the room?
2. Do you already have paint  colors chosen, or need help selecting?
3. What condition are the walls in currently?
4. This will be your first time painting, or do you have experience?"
```

---

## Development

### Running in Development Mode (with auto-reload):

```bash
npm run dev
```

This uses `nodemon` to automatically restart when you change code.

### Project Structure

```
chatbot-backend/
├── server.js          # Main backend server
├── package.json       # Dependencies
├── .env               # Your API key (DO NOT COMMIT!)
├──.env.example       # Template for .env
└── .gitignore         # Git ignore rules

ScieNatu/
├── chatbot-ai.js      # New AI chatbot frontend
├── scripts.js         # Existing site scripts
└── *.html             #All HTML pages
```

### Customizing the AI

Edit the `SYSTEM_PROMPT` in `server.js` (line 18) to change how the AI behaves:

```javascript
const SYSTEM_PROMPT = `You are Brandon, ScieNatu's DIY assistant...`;
```

You can modify:
- Tone and personality
- Types of questions it asks
- How it structures responses
- Product recommendation style

---

## Deployment

### Option 1: Vercel (Recommended - Free)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   cd chatbot-backend
   vercel
   ```

3. Add your API key in Vercel dashboard:
   - Go to Project Settings
   - Environment Variables
   - Add `GEMINI_API_KEY`

4. Update `chatbot-ai.js` line 12:
   ```javascript
   const BACKEND_URL = 'https://your-app.vercel.app';
   ```

### Option 2: Railway (Also Free)

1. Push to GitHub
2. Connect Railway to your repo
3. Add environment variable: `GEMINI_API_KEY`
4. Deploy!

### Option 3: Your Own Server

If you have a VPS or hosting:
```bash
# Install Node.js on your server
# Clone your code
# Install dependencies
npm install

# Run with PM2 for process management
npm install -g pm2
pm2 start server.js
pm2 save
```

---

## Troubleshooting

### "Failed to get response from server"

**Problem**: Cannot connect to backend

**Solutions**:
1. Make sure backend server is running (`npm start`)
2. Check console for errors
3. Verify `BACKEND_URL` in `chatbot-ai.js` matches your server

### "Invalid API Key"

**Problem**: Gemini API key not working

**Solutions**:
1. Verify you copied the full API key
2. Check for extra spaces in `.env` file
3. Make sure key is on the line: `GEMINI_API_KEY=...`
4. Restart server after changing `.env`

### "Rate Limit Exceeded"

**Problem**: Too many requests (15/minute on free tier)

**Solutions**:
1. This is rare for normal usage
2. If you hit it, wait 1 minute
3. Consider caching responses for common questions
4. Upgrade to paid tier if needed

### CORS Errors

**Problem**: Browser blocking requests

**Solution**: The backend uses `cors()` middleware to allow all origins. If you still get errors, check that `cors` is installed:
```bash
npm install cors
```

---

## Testing

### Test The Backend Directly

Use curl or Postman:

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to build a deck"}'
```

You should get back JSON with the AI's response.

### Health Check

```bash
curl http://localhost:3000/health
```

Should return: `{"status":"OK","message":"Chatbot backend is running"}`

---

## Cost Monitoring

### Free Tier Limits (Gemini 1.5 Flash)

- **15 requests per minute** (RPM)
- **1,500 requests per day** (RPD)
- **1 million requests per month**

For most small-to-medium websites, this is MORE than enough!

### Monitoring Usage

Check your usage at [Google AI Studio](https://ai.google.dev):
1. Click your project
2. View "Usage" tab
3. See daily/monthly stats

---

## Next Steps

Once Phase 1 is working, you can add:

✨ **Phase 2 Enhancements**:
- Save conversation history to database
- User accounts and personalization
- Analytics dashboard

✨ **Phase 3 Product Integration**:
- Connect to your product catalog
- AI searches products dynamically
- Direct "Add to Cart" from chat

✨ **Phase 4 Advanced Features**:
- Voice input
- Image recognition (for project photos)
- Multilingual support

---

## Support

If you need help:
1. Check the [Implementation Plan](../brain/.../ai_chatbot_implementation_plan.md)
2. Review [Google Gemini Docs](https://ai.google.dev/docs)
3. Test with curl to isolate frontend vs backend issues

---

## Security Notes

⚠️ **IMPORTANT**:
- Never commit `.env` to Git
- Never expose API key in frontend code
- Use HTTPS in production
- Add rate limiting for production use

The current setup is secure for testing, but for production:
1. Add request validation
2. Implement rate limiting
3. Use environment-specific configs
4. Monitor for abuse

---

**That's it! Your AI chatbot is ready to help customers!** 🎉

Questions? Check the implementation plan or Google Gemini documentation.
