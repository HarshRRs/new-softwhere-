import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/utils/supabase/server'
import { PERSONAS, FALLBACK_ROASTS } from '@/lib/roast-data'

const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null

const gemini = process.env.GOOGLE_API_KEY
  ? new GoogleGenerativeAI(process.env.GOOGLE_API_KEY)
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

    const persona = getRandomItem(PERSONAS)
    console.log(`Using Persona: ${persona.id}`)

    // --- Provider 1: Groq (Llama) ---
    if (groq) {
      try {
        console.log("Attempting Groq...")
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
          temperature: 0.8,
          response_format: { type: "json_object" }
        })

        const content = completion.choices[0]?.message?.content
        const data = content ? JSON.parse(content) : {}
        return NextResponse.json({ ...data, persona: persona.id, provider: "groq" })
      } catch (error) {
        console.error("Groq Failed, trying failover...", error)
      }
    }

    // --- Provider 2: Google Gemini (Flash) ---
    if (gemini) {
      try {
        console.log("Attempting Gemini...")
        const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } })

        const prompt = `${persona.content}

        Resume to Roast:
        ${resumeText}

        Return ONLY a JSON object with this exact schema:
        {
          "roast": "string, max 50 words, savage",
          "score": number (1-10),
          "cliches": ["string", "string", "string"],
          "oneLiner": "string, short viral insult",
          "animal": "string, spirit animal"
        }`

        const result = await model.generateContent(prompt)
        const response = await result.response
        const text = response.text()
        const data = JSON.parse(text)

        return NextResponse.json({ ...data, persona: persona.id, provider: "gemini" })

      } catch (error) {
         console.error("Gemini Failed...", error)
      }
    }

    // --- Fallback ---
    console.warn("All AI providers failed or missing keys. Using static fallback.")
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return NextResponse.json(getRandomItem(FALLBACK_ROASTS))

  } catch (error: any) {
    console.error('Roast API Critical Error:', error.message || error)
    return NextResponse.json(getRandomItem(FALLBACK_ROASTS))
  }
}
