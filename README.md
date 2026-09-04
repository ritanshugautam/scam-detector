# Is This a Scam?

A fraud detection web app for Indian users who receive suspicious WhatsApp or SMS messages. Paste a message, get an instant AI-powered verdict.

## The Problem

India loses billions of rupees every year to digital fraud. Scammers impersonate banks, UIDAI, government schemes, and popular brands to extract OTPs, Aadhaar numbers, and money from ordinary people. Most victims don't realize they're being scammed until it's too late — the message looks official, the urgency feels real, and the average person has no quick way to verify it.

This tool gives anyone a second opinion in seconds.

## Tech Stack

- **Frontend:** Vanilla HTML, CSS, JavaScript — no frameworks, no build step
- **Backend:** Node.js + Express
- **AI:** Anthropic Claude Sonnet (via the Messages API)
- **HTTP client:** Axios

## Run Locally

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a `.env` file** in the project root:

   ```
   ANTHROPIC_API_KEY=sk-ant-...
   ```

   Get your key at [console.anthropic.com](https://console.anthropic.com).

3. **Start the server**

   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
scam_detection/
├── frontend/
│   ├── index.html    # UI markup
│   ├── style.css     # Styling (responsive, mobile-first)
│   └── app.js        # Client logic (validation, fetch, render)
├── backend/
│   ├── server.js           # Express app + static file serving
│   └── routes/
│       └── analyze.js      # POST /api/analyze — calls Claude
├── .gitignore
├── package.json
└── README.md
```

## Screenshots

_Add screenshots here after running the app._

## Why I Built This

Scam messages in India are increasingly sophisticated. They use real bank logos, correct grammar, and urgent language designed to bypass rational thought. Someone in my family fell for a "KYC update" scam that looked identical to a real bank message.

I built this so anyone — regardless of how tech-savvy they are — can paste a suspicious message and get a clear verdict with specific red flags explained in plain English. The goal is to make fraud detection accessible, fast, and free.
