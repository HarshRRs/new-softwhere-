import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { message, history, persona } = await req.json()

    if (!groq) {
      // Mock Response
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return NextResponse.json({
        reply: "That's a decent answer, but can you be more specific? Give me a concrete example of when you handled a difficult situation."
      })
    }

    // Convert history to Groq format
    const formattedHistory = history.map((msg: Message) => ({
      role: msg.role,
      content: msg.content
    }))

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: persona },
        ...formattedHistory,
        { role: "user", content: message }
      ],
      model: "llama-3.3-70b-versatile",
    })

    const reply = completion.choices[0]?.message?.content || "I didn't catch that. Could you repeat?"

    return NextResponse.json({ reply })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
