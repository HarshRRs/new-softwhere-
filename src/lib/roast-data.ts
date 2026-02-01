
export const PERSONAS = [
  {
    id: "savage-recruiter",
    role: "system",
    content: "You are a burnout tech recruiter who hates their job. You are brutally honest, sarcastic, and rude. Analyze the resume and return a JSON object. Roast the candidate's formatting, lack of real skills, and buzzwords."
  },
  {
    id: "gen-z-critic",
    role: "system",
    content: "You are a Gen Z career influencer on TikTok. Use slang (no cap, mid, cringe, bet). Roast the resume for being 'cheugy' or 'boomer'. Return JSON."
  },
  {
    id: "gordon-ramsay",
    role: "system",
    content: "You are Gordon Ramsay, but for resumes. Yell (use caps). Insult the 'ingredients' (skills). Call them a donut. Return JSON."
  },
  {
    id: "passive-aggressive-hr",
    role: "system",
    content: "You are a passive-aggressive HR manager. Use lots of corporate speak to insult them thinly. 'We will keep your resume on file' energy. Return JSON."
  },
  {
    id: "tech-bro",
    role: "system",
    content: "You are a Silicon Valley Tech Bro/VC. You only care about scale, disruption, and AI. If they aren't a founder, they are nothing. Use crypto/AI buzzwords to mock them. Return JSON."
  },
  {
    id: "disappointed-asian-parent",
    role: "system",
    content: "You are a stereotypical disappointed Asian parent. Compare the candidate to 'Cousin Timmy' who is a neurosurgeon at 9. Why you no doctor? Why you resume so empty? Return JSON."
  },
  {
    id: "existential-philosopher",
    role: "system",
    content: "You are a nihilistic philosopher (Nietzsche/Sartre). Question the meaning of the resume. 'Why do we work? This PDF is a void.' Be dark and brooding. Return JSON."
  }
];

export const FALLBACK_ROASTS = [
  {
    roast: "Oh, look at this. Another 'passionate self-starter'. Your resume is so generic I almost fell asleep reading the header. You list 'Microsoft Word' as a skill? Congratulations, you're qualified to be a 3rd grader.",
    score: 2,
    cliches: ["Passionate", "Self-Starter", "Team Player", "Synergy"],
    oneLiner: "I'd hire you to water my plastic plants.",
    animal: "Sloth"
  },
  {
    roast: "I've seen hostage notes with better formatting than this. You claim to have 'attention to detail' but used three different fonts in the first section. The only thing this resume disrupts is my will to live.",
    score: 1,
    cliches: ["Detail-Oriented", "Go-Getter", "Strategic", "Thought Leader"],
    oneLiner: "Your resume looks like it was formatted by a cat walking on a keyboard.",
    animal: "Confused Pigeon"
  },
  {
    roast: "NO CAP, this resume is giving 'unemployed energy'. The vibes are off. You're trying way too hard with these buzzwords. It's giving desperation. It's giving 'please hire me I have student loans'.",
    score: 3,
    cliches: ["Hard Worker", "Motivated", "Dynamic", "Proactive"],
    oneLiner: "This resume is the definition of 'mid'.",
    animal: "Basic Golden Retriever"
  },
  {
    roast: "THIS IS RAW! YOU CALL THIS A RESUME? IT LOOKS LIKE A DOG'S DINNER! 'Proficient in Excel'? MY GRAN IS PROFICIENT IN EXCEL AND SHE'S 90! WAKE UP!",
    score: 0,
    cliches: ["Proficient", "Expert", "Experienced", "Guru"],
    oneLiner: "You are an absolute donut.",
    animal: "Donkey"
  },
  {
    roast: "We have reviewed your application and determined that you are perfect for a position... at our competitor. Your use of 'utilize' instead of 'use' really highlights your insecurity.",
    score: 4,
    cliches: ["Utilize", "Leverage", "Spearheaded", "Orchestrated"],
    oneLiner: "We will keep your resume on file (in the trash).",
    animal: "Corporate Hamster"
  },
  {
    roast: "You describe yourself as a 'Visionary'. The only vision I see here is unemployment. Your bullet points are longer than a CVS receipt but say absolutely nothing.",
    score: 2,
    cliches: ["Visionary", "Innovator", "Game-Changer", "Disruptor"],
    oneLiner: "You have the career trajectory of a fidget spinner.",
    animal: "Mayfly"
  },
  {
    roast: "I tried to find a single quantifyable achievement in this document, but all I found were adjectives. 'Responsible for'... responsible for what? Breathing? Taking up space?",
    score: 1,
    cliches: ["Responsible for", "Tasked with", "Helped", "Assisted"],
    oneLiner: "You are the human equivalent of a participation trophy.",
    animal: "Jellyfish"
  },
  {
    roast: "This resume is so dry it just evaporated my coffee. You seem like the kind of person who reminds the teacher to collect homework. 'Communication Skills'? You didn't even communicate why I should hire you.",
    score: 3,
    cliches: ["Communication", "Organized", "Punctual", "Reliable"],
    oneLiner: "I'm bored just looking at your font choice.",
    animal: "Beige Wall Paint"
  },
  {
    roast: "Stop trying to make 'Customer Obsessed' happen. It's not going to happen. You worked at a retail store for 3 months. That's not a career, that's a summer tragedy.",
    score: 2,
    cliches: ["Customer Obsessed", "Client-Focused", "Service-Oriented"],
    oneLiner: "Your experience section is thinner than single-ply toilet paper.",
    animal: "Goldfish"
  },
  {
    roast: "Wow, a 'Social Media Guru' with 200 followers. Impressive. Please tell me more about how you 'curated content'. This entire PDF screams 'I need validation'.",
    score: 1,
    cliches: ["Guru", "Ninja", "Wizard", "Rockstar"],
    oneLiner: "You're not a guru, you're just on your phone a lot.",
    animal: "Peacock"
  }
];

export const ERROR_ROASTS = [
  {
    roast: "Our roasting servers are currently on fire (literally). But since we're here, let's talk about your internet connection. It's as slow as your career progression. Try again when you have better WiFi.",
    score: 0,
    cliches: ["Network Error", "WiFi Issues", "Server Meltdown", "404 Career Not Found"],
    oneLiner: "Even the internet is trying to save you from this roast.",
    animal: "Dead Server Hamster"
  },
  {
    roast: "System Overload. Your resume was so bad it actually crashed our AI. We've never seen formatting this chaotic before. Congratulations, you broke the matrix with your incompetence.",
    score: -1,
    cliches: ["Stack Overflow", "System Crash", "Fatal Error", "Blue Screen of Death"],
    oneLiner: "Your resume is a digital weapon of mass destruction.",
    animal: "Glitch Gremlin"
  },
  {
    roast: "We couldn't connect to the roast database. It's probably refusing to process another 'Team Player' resume. Please try again, or take the hint and rewrite it.",
    score: 1,
    cliches: ["Connection Refused", "Timeout", "Latency", "Buffering"],
    oneLiner: "The server ghosted you, just like every recruiter ever.",
    animal: "Ghost"
  },
  {
    roast: "Error 500: Talent Not Found. We encountered an issue processing your request. Honestly, we're doing you a favor. Ignorance is bliss.",
    score: 0,
    cliches: ["Error 500", "Internal Server Error", "Bad Gateway"],
    oneLiner: "Task failed successfully.",
    animal: "404 Page"
  }
];
