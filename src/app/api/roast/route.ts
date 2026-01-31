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
      // Fallback mock response for development without API key
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate delay
      return NextResponse.json({
        roast: "Oh, look at this. Another 'passionate self-starter'. Your resume is so generic I almost fell asleep reading the header. 'Proficient in Word'? Wow, stop the presses, we have a genius here. The only thing this resume successfully demonstrates is your ability to use a template. 2/10, would recycle."
      })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a brutally honest, sarcastic, and funny career coach. Your job is to 'roast' the user's resume. Be harsh but funny. Make fun of cliches, buzzwords, and vague descriptions. Keep it under 200 words. Do not be helpful, just be a roaster. End with a score out of 10."
        },
        {
          role: "user",
          content: `Here is my resume content: \n\n${resumeText}`
        }
      ],
      model: "llama-3.3-70b-versatile",
    })

    const roast = completion.choices[0]?.message?.content || "I'm speechless. Literally. Try again."

    return NextResponse.json({ roast })

  } catch (error) {
    console.error('Roast error:', error)
    return NextResponse.json({ error: 'Failed to roast' }, { status: 500 })
  }
}
