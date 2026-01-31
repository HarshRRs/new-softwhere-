import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

export async function POST(req: Request) {
  try {
    const { topic, tone } = await req.json()

    if (!groq) {
      // Mock Response
      await new Promise((resolve) => setTimeout(resolve, 1500))
      return NextResponse.json({
        posts: [
          `🚀 Just started my journey with ${topic}! \n\nIt's crazy how much the industry is changing. Here are 3 things I learned this week:\n\n1️⃣ Point one\n2️⃣ Point two\n3️⃣ Point three\n\nWhat do you think? 👇 #CareerGrowth #Tech`,
          `Unpopular Opinion: ${topic} is overrated. 🤷‍♂️\n\nHere is why I think we are looking at it all wrong...\n\n[Deep dive details]\n\nDo you agree?`,
          `I used to struggle with ${topic}. \n\nThen I realized one simple truth: consistency is key. \n\nHere is my new routine...`
        ]
      })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a LinkedIn viral content expert. Generate a JSON object with a 'posts' array containing 3 distinct post variations based on the user's topic and tone. 1. Hook-heavy. 2. Story-driven. 3. Listicle/Value-heavy. Use line breaks and emojis appropriate for LinkedIn."
        },
        {
          role: "user",
          content: `Topic: ${topic}\nTone: ${tone}`
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
    return NextResponse.json({ error: 'Failed to generate posts' }, { status: 500 })
  }
}
