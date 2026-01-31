interface Job {
  title: string
  company: string
  url: string
  location: string
  salary?: string
}

export function generateDigestHtml(jobs: Job[], userName: string = 'Job Seeker') {
  const jobsHtml = jobs.map(job => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 12px; background-color: #ffffff;">
      <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 18px;">
        <a href="${job.url}" style="color: #2563eb; text-decoration: none;">${job.title}</a>
      </h3>
      <p style="margin: 0 0 4px 0; color: #4b5563;"><strong>${job.company}</strong> • ${job.location}</p>
      ${job.salary ? `<p style="margin: 0; color: #059669; font-size: 14px;">💰 ${job.salary}</p>` : ''}
      <div style="margin-top: 12px;">
        <a href="${job.url}" style="background-color: #000000; color: #ffffff; padding: 8px 12px; border-radius: 4px; text-decoration: none; font-size: 12px; display: inline-block;">Apply Now</a>
      </div>
    </div>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
      <body style="font-family: sans-serif; background-color: #f9fafb; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #7c3aed; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Bloom Daily Digest</h1>
          </div>
          <div style="padding: 24px;">
            <p style="color: #374151; font-size: 16px;">Hi ${userName},</p>
            <p style="color: #374151; font-size: 16px;">Here are 3 new jobs we found for you today:</p>

            ${jobsHtml}

            <div style="margin-top: 32px; text-align: center;">
              <a href="https://bloom-career.ai/dashboard" style="background-color: #7c3aed; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">View All Jobs</a>
            </div>
          </div>
          <div style="background-color: #f3f4f6; padding: 16px; text-align: center; color: #6b7280; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Bloom Career AI</p>
            <p>You received this because you are subscribed to daily alerts.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
