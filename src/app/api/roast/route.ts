import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

export async function POST(req: Request) {
  try {
    const { resumeText } = await req.json()

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required' }, { status: 400 })
    }

    if (!groq) {
      // Fallback mock response
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return NextResponse.json({
        roast: "Oh, look at this. Another 'passionate self-starter'. Your resume is so generic I almost fell asleep reading the header.",
        score: 2,
        cliches: ["Passionate", "Self-Starter", "Team Player", "Synergy"],
        oneLiner: "I'd hire you to water my plastic plants.",
        animal: "Sloth"
      })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a brutally honest, sarcastic career coach. Analyze the resume and return a JSON object with: 1. 'roast' (string, max 50 words, savage). 2. 'score' (number 1-10, be harsh). 3. 'cliches' (array of 3-5 detected buzzwords). 4. 'oneLiner' (string, a short viral insult). 5. 'animal' (string, a spirit animal that matches their laziness/incompetence, e.g., 'Confused Sloth'). Return ONLY JSON."
        },
        {
          role: "user",
          content: `Resume: ${resumeText}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0]?.message?.content
    const data = content ? JSON.parse(content) : {}

    return NextResponse.json(data)

  } catch (error) {
    console.error('Roast error:', error)
    return NextResponse.json({ error: 'Failed to roast' }, { status: 500 })
  }
}
