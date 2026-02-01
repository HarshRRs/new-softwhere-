# Bloom - The AI Career Companion 🌸

Bloom is a comprehensive, AI-powered platform designed to automate and optimize every stage of the job search process. From "roasting" your resume to real-time interview assistance, Bloom gives candidates an "unfair advantage."

![Bloom Dashboard](https://via.placeholder.com/1200x600.png?text=Bloom+Dashboard+Preview)

## 🚀 Killer Features

### 1. Viral Resume Roaster 🔥
*   **What it is:** Upload your resume and get a brutally honest, sarcastic AI critique.
*   **Viral Hook:** Generates a shareable "Roast Card" with a toxicity score and spirit animal (e.g., "Confused Sloth").
*   **Goal:** Drive social traffic via Twitter/LinkedIn sharing.

### 2. Job Feed & Backdoor Access 🕵️
*   **Real Data:** Aggregates remote jobs from RemoteOK and WeWorkRemotely.
*   **Smart Apply:** Generates tailored, AI-written cover letters instantly.
*   **Backdoor Access:** Finds the likely hiring manager and writes a "Cold DM" script to bypass the queue.

### 3. Interview Copilot (Cheat Mode) 🤖
*   **Real-Time Assist:** A stealthy interface that listens to your interview audio.
*   **Flashcards:** Detects keywords ("weakness", "salary") and pops up instant answer suggestions.
*   **Goal:** Act as a digital cheat sheet during Zoom calls.

### 4. Voice Interview Coach 🎙️
*   **Practice Mode:** Talk to AI personas (Tough Tech Lead, Friendly HR, Intense Founder).
*   **Tech:** Uses Browser Speech-to-Text and Text-to-Speech for a natural conversation loop.

### 5. Salary Negotiation Coach 💰
*   **Strategy:** Input your offer details (Salary, Equity) and get a data-backed counter-offer plan.
*   **Scripts:** Generates the exact email to send to recruiters to increase your comp.

### 6. LinkedIn Growth Engine 📈
*   **Content Generator:** Creates 3 variations of viral-style LinkedIn posts based on your topic.
*   **Goal:** Build your personal brand and attract inbound recruiters.

---

## 🛠️ Tech Stack

*   **Framework:** Next.js 15 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS + Framer Motion
*   **Database & Auth:** Supabase
*   **AI:** Groq (Llama 3)
*   **Payments:** Stripe
*   **Emails:** Resend
*   **Scraping:** RSS Parser + Playwright (Mocked)

---

## ⚡ Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-repo/bloom.git
cd bloom
npm install
```

### 2. Environment Variables
Create a `.env.local` file with the following keys:

```bash
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# AI (Text Generation)
GROQ_API_KEY=your_groq_api_key

# Payments (Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_pub_key

# Emails (Daily Digest)
RESEND_API_KEY=your_resend_api_key
```

### 3. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000`.

---

## 🚢 Deployment (Vercel)

1.  Push code to GitHub.
2.  Import project into Vercel.
3.  Add the Environment Variables in Vercel Settings.
4.  **Cron Jobs:** The Daily Digest is configured in `vercel.json` to run at 9 AM automatically.

---

## 📢 Zero-Marketing Strategy

1.  **Phase 1: The Roast (Viral):**
    *   Post on r/csMajors, r/resumes: *"I built an AI that roasts your resume. How bad is yours?"*
    *   Encourage users to share their "Spirit Animal" card.

2.  **Phase 2: The Copilot (Controversial):**
    *   TikTok/Reels: *"Using AI to cheat in my interview (Educational Purposes Only)"*.
    *   Show the real-time flashcards popping up.

3.  **Phase 3: Success Stories:**
    *   LinkedIn: *"How I negotiated $15k more using this free script generator."*

---

## 📝 License

MIT License. Built for the modern job seeker.
