'use client'

import { useState } from 'react'
import { Briefcase, MapPin, DollarSign, ExternalLink, Loader2, Sparkles } from 'lucide-react'

interface Job {
  id?: string
  title: string
  company: string
  location: string
  salary: string
  url: string
  description: string
  status: string
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')

  const fetchJobs = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/jobs/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })
      const data = await response.json()
      if (data.jobs) {
        setJobs(data.jobs)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          Job Feed
        </h3>
        <div className="flex gap-2 w-full md:w-auto">
           <input
             placeholder="Search keywords..."
             className="border rounded-md px-3 py-1.5 text-sm flex-1"
             value={keyword}
             onChange={(e) => setKeyword(e.target.value)}
           />
           <button
             onClick={fetchJobs}
             disabled={loading}
             className="bg-black text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
             Find Jobs
           </button>
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg">
          <p>No jobs found yet. Run a search to start the engine.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h4 className="font-bold text-lg text-blue-600 hover:underline cursor-pointer" onClick={() => window.open(job.url, '_blank')}>
                    {job.title}
                </h4>
                <div className="text-sm font-medium text-gray-800">{job.company}</div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  {job.salary && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-200 transition-colors whitespace-nowrap">
                   Auto-Apply ⚡
                 </button>
                 <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-600">
                   <ExternalLink className="w-5 h-5" />
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
