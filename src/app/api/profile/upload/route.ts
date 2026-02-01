import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
// Import standard node modules for pdfjs-dist usage in Node environment
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}`)

    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse PDF using pdfjs-dist
    // We need to disable the worker for serverless environments to avoid "worker not found" errors
    const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        useSystemFonts: true,
        disableFontFace: true,
    })

    const doc = await loadingTask.promise

    let text = ''
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const content = await page.getTextContent()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const strings = content.items.map((item: any) => item.str)
        text += strings.join(' ') + '\n'
    }

    console.log(`Extracted ${text.length} characters.`)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
        console.error("Auth Error:", authError)
        // We continue even if auth fails, just to return the text to the UI
    }

    if (user) {
        const { error: dbError } = await supabase.from('profiles').update({
            resume_text: text,
            updated_at: new Date().toISOString()
        }).eq('id', user.id)

        if (dbError) {
            console.error("DB Update Error:", dbError)
        } else {
            console.log("Profile updated successfully.")
        }
    }

    // Return the text so the frontend can use it immediately (for Roaster/Builder)
    return NextResponse.json({ success: true, textLength: text.length, text })

  } catch (error) {
    console.error("PDF Parsing Error:", error)
    return NextResponse.json({ error: 'Failed to parse PDF. Check server logs.' }, { status: 500 })
  }
}
