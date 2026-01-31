import { NextResponse } from 'next/server'
import { scrapeJobs } from '@/lib/scraper/engine'
import { createClient } from '@/utils/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { keyword } = await req.json()
    const jobs = await scrapeJobs(keyword || 'developer')

    // Insert jobs into Supabase
    const { error } = await supabase.from('jobs').insert(
      jobs.map(job => ({
        ...job,
        user_id: user.id,
        status: 'new'
      }))
    )

    if (error) {
       console.error('Supabase error:', error)
       // Don't fail the request if DB fails (e.g. table doesn't exist yet in local mock), just return the jobs
    }

    return NextResponse.json({ success: true, count: jobs.length, jobs })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to scrape' }, { status: 500 })
  }
}
