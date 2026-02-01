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

    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse PDF using pdfjs-dist
    const data = new Uint8Array(buffer)
    const loadingTask = pdfjsLib.getDocument(data)
    const doc = await loadingTask.promise

    let text = ''
    for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i)
        const content = await page.getTextContent()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const strings = content.items.map((item: any) => item.str)
        text += strings.join(' ') + '\n'
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
        await supabase.from('profiles').update({
            resume_text: text,
            updated_at: new Date().toISOString()
        }).eq('id', user.id)
    }

    // Return the text so the frontend can use it immediately (for Roaster/Builder)
    return NextResponse.json({ success: true, textLength: text.length, text })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to parse' }, { status: 500 })
  }
}
