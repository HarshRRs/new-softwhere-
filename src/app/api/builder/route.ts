import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json()

    if (type === 'enhance_experience') {
      const { role, company, description } = data

      if (!groq) {
        // Mock Response
        await new Promise((resolve) => setTimeout(resolve, 1500))
        return NextResponse.json({
          enhancedText: `• Spearheaded critical projects at ${company} as a ${role}, driving efficiency improvements.\n• Collaborated with cross-functional teams to deliver high-quality solutions ahead of schedule.\n• Optimized legacy systems resulting in a 20% performance increase.\n• Mentored junior developers and established best practices for code quality.`
        })
      }

      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert resume writer. Enhance the user's experience description. Use strong action verbs, quantify results where possible, and make it sound professional yet authentic. Return ONLY the enhanced bullet points. Do not add introductory text."
          },
          {
            role: "user",
            content: `Role: ${role}\nCompany: ${company}\nDraft Description: ${description || "General software development tasks"}`
          }
        ],
        model: "llama-3.3-70b-versatile",
      })

      const enhancedText = completion.choices[0]?.message?.content || description
      return NextResponse.json({ enhancedText })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
