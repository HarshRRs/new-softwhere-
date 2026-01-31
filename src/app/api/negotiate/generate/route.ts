import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

export async function POST(req: Request) {
  try {
    const { role, company, baseSalary, targetSalary, equity, benefits } = await req.json()

    if (!groq) {
      // Mock Response
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return NextResponse.json({
        strategy: "1. Acknowledge the offer enthusiastically.\n2. Pivot to the market value of your specific skills (React, AI).\n3. Mention the specific value you bring to the team structure.\n4. Ask for the 140k but be willing to trade equity for cash if needed.",
        email: `Subject: Thoughts on the offer - ${role}

Hi [Recruiter Name],

Thank you so much for the offer to join ${company} as a ${role}. I'm incredibly excited about the team and the mission.

I've reviewed the details, and while the package is strong, I was hoping to see the base salary closer to $${targetSalary}. Based on my experience and market research for this level of role, that number reflects the value I'm ready to bring from day one.

Is there any flexibility to bridge this gap? I'm happy to discuss adjusting the equity component or signing bonus to make this work.

Best,
[Your Name]`
      })
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a world-class salary negotiation coach (ex-Google Recruiter). Generate a JSON object with two fields: 'strategy' (a bulleted list of leverage points and tactics, keep it concise) and 'email' (a professional, firm, but polite counter-offer email). Focus on value, not personal need."
        },
        {
          role: "user",
          content: `Role: ${role}\nCompany: ${company}\nCurrent Offer: ${baseSalary}\nTarget: ${targetSalary}\nEquity: ${equity}\nBenefits/Context: ${benefits}`
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
    return NextResponse.json({ error: 'Failed to generate strategy' }, { status: 500 })
  }
}
