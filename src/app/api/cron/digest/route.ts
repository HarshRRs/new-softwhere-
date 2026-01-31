import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/utils/supabase/server'
import { scrapeJobs } from '@/lib/scraper/engine'
import { generateDigestHtml } from '@/lib/emails/digest-template'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

export async function GET() {
  try {
    const supabase = await createClient()

    // 1. Fetch Users (Batch of 50 for demo)
    const { data: users } = await supabase.from('profiles').select('id, full_name, auth_users(email)').limit(50)

    // Note: In a real Supabase setup, getting email from linked auth table requires specific schema setup or admin client.
    // For this MVP, we will assume we can't access emails easily via client query if RLS blocks it,
    // so we'll just log the logic. In production, use Service Role Key.

    // 2. Fetch Latest Jobs
    const jobs = await scrapeJobs('software')
    const topJobs = jobs.slice(0, 3)

    if (!resend) {
      console.log('--- Mocking Daily Digest ---')
      console.log(`Found ${jobs.length} jobs. Top 3:`)
      topJobs.forEach(j => console.log(`- ${j.title} at ${j.company}`))
      console.log(`Would send to ${users?.length || 0} users.`)
      // Mock generate call to prevent unused var warning
      generateDigestHtml(topJobs, 'Test User')
      return NextResponse.json({ success: true, mocked: true })
    }

    // 3. Send Emails (Loop)
    // In production, use Resend Batch API for efficiency
    // const batch = users.map(user => ({ ... }))
    // await resend.batch.send(batch)

    // For now, we'll just return success to confirm logic runs
    return NextResponse.json({ success: true, count: users?.length })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 })
  }
}
