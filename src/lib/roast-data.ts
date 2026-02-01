
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
  }
];
