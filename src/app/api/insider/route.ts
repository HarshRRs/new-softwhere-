import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

export async function POST(req: Request) {
  try {
    const { company } = await req.json()

    if (!company) return NextResponse.json({ error: 'Company required' }, { status: 400 })

    if (!groq) {
      // Mock Data
      await new Promise((resolve) => setTimeout(resolve, 1000))
      return NextResponse.json({
        values: ["Innovation", "User Obsession", "Move Fast"],
        news: `${company} recently announced expansion into AI markets and cost-cutting measures.`,
        redFlags: ["High turnover in engineering", " frequent reorgs"]
      })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a tech industry insider. For the given company, provide: 1. 3 core cultural values (short). 2. A one-sentence summary of recent news/buzz. 3. 2 potential red flags for candidates. Return valid JSON only with keys: values (array), news (string), redFlags (array)."
        },
        {
          role: "user",
          content: `Company: ${company}`
        }
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0]?.message?.content
    const data = content ? JSON.parse(content) : {}
    return NextResponse.json(data)

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
