import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PDFParser = require("pdf2json");

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log(`Processing file: ${file.name}, size: ${file.size}`)

    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse using pdf2json
    const pdfParser = new PDFParser(null, 1); // 1 = Text content only

    const text = await new Promise<string>((resolve, reject) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", () => {
            const rawText = pdfParser.getRawTextContent();
            resolve(rawText);
        });

        pdfParser.parseBuffer(buffer);
    });

    console.log(`Extracted ${text.length} characters using pdf2json.`)

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
        console.error("Auth Error:", authError)
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

    return NextResponse.json({ success: true, textLength: text.length, text })

  } catch (error) {
    console.error("PDF Parsing Error:", error)
    return NextResponse.json({ error: 'Failed to parse PDF.' }, { status: 500 })
  }
}
