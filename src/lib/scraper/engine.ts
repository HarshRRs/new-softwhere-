import Parser from 'rss-parser'

export interface ScrapedJob {
  title: string
  company: string
  location: string
  salary: string
  url: string
  description: string
  source: string
  date: string
}

const parser = new Parser()

export async function scrapeJobs(keyword: string = 'software'): Promise<ScrapedJob[]> {
  const jobs: ScrapedJob[] = []

  // 1. Fetch from RemoteOK API
  try {
    console.log(`Fetching RemoteOK jobs for ${keyword}...`)
    // RemoteOK API is just a JSON endpoint
    const response = await fetch('https://remoteok.com/api', { next: { revalidate: 3600 } })
    if (response.ok) {
        const data = await response.json()
        // First element is legal text, skip it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const listings = data.slice(1).filter((job: any) =>
            job.position?.toLowerCase().includes(keyword.toLowerCase()) ||
            job.tags?.some((tag: string) => tag.toLowerCase().includes(keyword.toLowerCase()))
        ).slice(0, 10) // Limit to 10 for speed

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        listings.forEach((job: any) => {
            jobs.push({
                title: job.position,
                company: job.company,
                location: job.location || 'Remote',
                salary: job.salary || 'Not disclosed',
                url: job.apply_url || job.url,
                description: job.description, // HTML content
                source: 'RemoteOK',
                date: job.date
            })
        })
    }
  } catch (e) {
      console.error("RemoteOK fetch failed", e)
  }

  // 2. Fetch from WeWorkRemotely RSS
  try {
      console.log(`Fetching WWR jobs...`)
      // Note: WWR RSS returns ALL jobs, filtering locally
      const feed = await parser.parseURL('https://weworkremotely.com/remote-jobs.rss')

      const listings = feed.items.filter(item =>
        item.title?.toLowerCase().includes(keyword.toLowerCase()) ||
        item.contentSnippet?.toLowerCase().includes(keyword.toLowerCase())
      ).slice(0, 10)

      listings.forEach(item => {
          // Title format is often "Company: Position" or "Position: Company"
          const parts = item.title?.split(':') || []
          const company = parts.length > 1 ? parts[0].trim() : 'Unknown'
          const title = parts.length > 1 ? parts.slice(1).join(':').trim() : item.title || 'Unknown'

          jobs.push({
              title: title,
              company: company,
              location: 'Remote',
              salary: 'Not disclosed',
              url: item.link || '',
              description: item.contentSnippet || '',
              source: 'WeWorkRemotely',
              date: item.pubDate || new Date().toISOString()
          })
      })

  } catch (e) {
      console.error("WWR fetch failed", e)
  }

  // Fallback Mock Data if everything fails
  if (jobs.length === 0) {
      return [
        {
          title: 'Senior React Developer (Mock)',
          company: 'Fallback Inc',
          location: 'Remote',
          salary: '$140k',
          url: '#',
          description: 'The APIs failed, so here is a mock job.',
          source: 'System',
          date: new Date().toISOString()
        }
      ]
  }

  return jobs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
