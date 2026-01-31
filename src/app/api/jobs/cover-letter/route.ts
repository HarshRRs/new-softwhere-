import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

export async function POST(req: Request) {
  try {
    const { jobTitle, company, description, jobUrl } = await req.json()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let resumeText = "General software engineering background"
    let userName = "[Your Name]"

    if (user) {
        const { data } = await supabase.from('profiles').select('resume_text, full_name').eq('id', user.id).single()
        if (data?.resume_text) resumeText = data.resume_text
        if (data?.full_name) userName = data.full_name
    }

    let letter = ""

    if (!groq) {
      // Mock Response
      await new Promise((resolve) => setTimeout(resolve, 1500))
      letter = `Dear Hiring Manager at ${company},\n\nI am writing to express my enthusiastic interest in the ${jobTitle} position. With my background in ${resumeText.substring(0, 20)}... and a proven track record of delivering high-quality code, I am confident in my ability to contribute effectively to your team.\n\n[...Mock Cover Letter Content...]\n\nBest regards,\n${userName}`
    } else {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an expert career coach. Write a compelling, professional cover letter for the specified job based on the user's resume. Keep it under 200 words. Use a confident tone. Highlight specific matches between the resume and job description."
          },
          {
            role: "user",
            content: `Job Title: ${jobTitle}\nCompany: ${company}\nJob Description: ${description.substring(0, 500)}...\n\nUser Resume: ${resumeText.substring(0, 1000)}...`
          }
        ],
        model: "llama-3.3-70b-versatile",
      })
      letter = completion.choices[0]?.message?.content || "Failed to generate."
    }

    // Save to Applications table if user is logged in
    if (user) {
        await supabase.from('applications').insert({
            user_id: user.id,
            job_title: jobTitle,
            company: company,
            cover_letter: letter,
            job_url: jobUrl,
            status: 'applied'
        })
    }

    return NextResponse.json({ letter })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
