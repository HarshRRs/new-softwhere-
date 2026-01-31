'use client'

import { useState } from 'react'
import { Briefcase, MapPin, DollarSign, ExternalLink, Loader2, Sparkles, X, Copy, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Job {
  id?: string
  title: string
  company: string
  location: string
  salary: string
  url: string
  description: string
  status: string
  source: string
}

export default function JobList() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(false)
  const [keyword, setKeyword] = useState('')

  // Cover Letter State
  const [generatingId, setGeneratingId] = useState<number | null>(null)
  const [coverLetter, setCoverLetter] = useState<{jobIndex: number, text: string} | null>(null)
  const [copied, setCopied] = useState(false)

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

  const generateCoverLetter = async (job: Job, index: number) => {
    setGeneratingId(index)
    try {
      const response = await fetch('/api/jobs/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            jobTitle: job.title,
            company: job.company,
            description: job.description
        }),
      })
      const data = await response.json()
      setCoverLetter({ jobIndex: index, text: data.letter })
    } catch (e) {
      console.error(e)
    } finally {
      setGeneratingId(null)
    }
  }

  const copyToClipboard = () => {
    if (coverLetter) {
        navigator.clipboard.writeText(coverLetter.text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 relative">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h3 className="font-bold text-xl flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          Real-Time Job Feed
        </h3>
        <div className="flex gap-2 w-full md:w-auto">
           <input
             placeholder="Search keywords..."
             className="border rounded-md px-3 py-1.5 text-sm flex-1"
             value={keyword}
             onChange={(e) => setKeyword(e.target.value)}
             onKeyDown={(e) => e.key === 'Enter' && fetchJobs()}
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
        <div className="text-center py-12 text-gray-500 border-2 border-dashed rounded-lg bg-gray-50">
          <p>No jobs found yet. Run a search to see live opportunities.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job, i) => (
            <div key={i} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between gap-4 relative">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                   <h4 className="font-bold text-lg text-blue-600 hover:underline cursor-pointer" onClick={() => window.open(job.url, '_blank')}>
                        {job.title}
                   </h4>
                   <span className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600">{job.source}</span>
                </div>
                <div className="text-sm font-medium text-gray-800">{job.company}</div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                  {job.salary && job.salary !== 'Not disclosed' && <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> {job.salary}</span>}
                </div>
              </div>

              <div className="flex items-center gap-2 self-start md:self-center">
                 <button
                    onClick={() => generateCoverLetter(job, i)}
                    disabled={generatingId === i}
                    className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-200 transition-colors whitespace-nowrap flex items-center gap-2"
                 >
                   {generatingId === i ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                   Generate Cover Letter
                 </button>
                 <a href={job.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-gray-600">
                   <ExternalLink className="w-5 h-5" />
                 </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cover Letter Modal Overlay */}
      <AnimatePresence>
        {coverLetter && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: 20 }}
                    className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
                >
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="font-bold text-xl">AI Cover Letter</h3>
                        <button onClick={() => setCoverLetter(null)} className="text-gray-500 hover:text-gray-700">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto flex-1 bg-gray-50 font-mono text-sm whitespace-pre-wrap">
                        {coverLetter.text}
                    </div>

                    <div className="p-6 border-t flex justify-end gap-2">
                        <button onClick={() => setCoverLetter(null)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                            Close
                        </button>
                        <button
                            onClick={copyToClipboard}
                            className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 flex items-center gap-2 transition-all"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
