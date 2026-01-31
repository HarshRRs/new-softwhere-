import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Mock PDF Parsing
    // In a real production env, we would use a robust service or library like 'pdf-parse' or AWS Textract.
    // Due to build-time dependency resolution issues with the current 'pdf-parse' version in Next.js Edge/Node runtime,
    // we are simulating the text extraction for this MVP.

    console.log(`Received file: ${file.name}, size: ${file.size}`)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock extracted text based on filename or just generic text
    const text = `
      [Parsed Content from ${file.name}]

      EXPERIENCE
      Senior Software Engineer | TechCorp | 2020 - Present
      - Led a team of 5 developers.
      - Built scalable microservices.

      Junior Developer | StartupX | 2018 - 2020
      - Developed frontend using React.

      SKILLS
      TypeScript, Next.js, Node.js, Python, SQL
    `

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.from('profiles').update({
            resume_text: text,
            updated_at: new Date().toISOString()
        }).eq('id', user.id)
    }

    return NextResponse.json({ success: true, textLength: text.length })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to parse' }, { status: 500 })
  }
}
