'use client'

import { useState } from 'react'
import { Search, Loader2, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface InsiderInfo {
  values: string[]
  news: string
  redFlags: string[]
}

export default function CompanyInsider() {
  const [company, setCompany] = useState('')
  const [info, setInfo] = useState<InsiderInfo | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!company) return
    setLoading(true)
    setInfo(null)

    try {
      const response = await fetch('/api/insider', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company }),
      })
      const data = await response.json()
      setInfo(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm h-full">
      <div className="flex items-center gap-2 mb-4">
         <Building2 className="text-purple-600" />
         <h3 className="font-bold text-lg">Company Insider</h3>
      </div>
      <p className="text-sm text-gray-500 mb-4">Get the cheat sheet before you apply.</p>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="e.g. Spotify, Netflix..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading || !company}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </button>
      </div>

      {info && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-1">Core Values (Mention these!)</h4>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {info.values.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm text-blue-700 mb-1">Recent Buzz</h4>
            <p className="text-sm text-gray-700">{info.news}</p>
          </div>
           <div>
            <h4 className="font-semibold text-sm text-red-600 mb-1">Potential Red Flags</h4>
             <ul className="list-disc list-inside text-sm text-gray-700">
              {info.redFlags.map((v, i) => <li key={i}>{v}</li>)}
            </ul>
          </div>
        </motion.div>
      )}
    </div>
  )
}
