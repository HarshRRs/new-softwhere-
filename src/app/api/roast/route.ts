import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { createClient } from '@/utils/supabase/server'
import { PERSONAS, FALLBACK_ROASTS } from '@/lib/roast-data'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

export async function POST(req: Request) {
  try {
    let { resumeText } = await req.json()

    // If no text provided, try to fetch from profile
    if (!resumeText) {
       const supabase = await createClient()
       const { data: { user } } = await supabase.auth.getUser()

       if (user) {
         const { data } = await supabase.from('profiles').select('resume_text').eq('id', user.id).single()
         if (data?.resume_text) {
            resumeText = data.resume_text
         }
       }
    }

    if (!resumeText) {
      return NextResponse.json({ error: 'Resume text is required. Please paste it or upload a resume in your profile.' }, { status: 400 })
    }

    // 1. Check for API Key
    if (!groq) {
      console.warn("GROQ_API_KEY is missing. Using fallback.")
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate delay
      return NextResponse.json(getRandomItem(FALLBACK_ROASTS))
    }

    // 2. Select a Random Persona
    const persona = getRandomItem(PERSONAS)
    console.log(`Using Persona: ${persona.id}`)

    try {
        const completion = await groq.chat.completions.create({
        messages: [
            {
            role: "system",
            content: `${persona.content} Return a JSON object with: 1. 'roast' (string, max 50 words, savage). 2. 'score' (number 1-10, be harsh). 3. 'cliches' (array of 3-5 detected buzzwords). 4. 'oneLiner' (string, a short viral insult). 5. 'animal' (string, a spirit animal that matches their laziness/incompetence). Return ONLY JSON.`
            },
            {
            role: "user",
            content: `Resume: ${resumeText}`
            }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.8, // Increase variety
        response_format: { type: "json_object" }
        })

        const content = completion.choices[0]?.message?.content

        let data;
        try {
            data = content ? JSON.parse(content) : {}
        } catch (parseError) {
            console.error("JSON Parse Error. Raw content:", content)
            throw new Error("Failed to parse model response")
        }

        // Add persona ID to response for debugging/display if needed
        return NextResponse.json({ ...data, persona: persona.id })

    } catch (groqError: any) {
        console.error("Groq API Failed:", groqError)
        // Fallback to random roast on API failure
        return NextResponse.json(getRandomItem(FALLBACK_ROASTS))
    }

  } catch (error: any) {
    console.error('Roast API Critical Error:', error.message || error)
    // Absolute final fallback
    return NextResponse.json(getRandomItem(FALLBACK_ROASTS))
  }
}
