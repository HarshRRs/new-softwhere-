'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Flame, Loader2, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function RoastPage() {
  const [resumeText, setResumeText] = useState('')
  const [roast, setRoast] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleRoast = async () => {
    if (!resumeText) return
    setLoading(true)
    setRoast(null)

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })
      const data = await response.json()
      setRoast(data.roast)
    } catch (error) {
      console.error('Failed to roast:', error)
      setRoast("My roasting circuits are overheated. Try again later, or maybe your resume is just too boring to roast.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 flex items-center justify-center gap-4">
          <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
          Resume Roaster
          <Flame className="w-12 h-12 text-orange-500 animate-pulse" />
        </h1>
        <p className="text-xl text-gray-600">
          Prepare to be humbled. AI will brutally analyze your resume.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Paste your resume content here
            </label>
            <textarea
              className="w-full h-96 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none font-mono text-sm"
              placeholder="Jane Doe, Software Engineer..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <button
              onClick={handleRoast}
              disabled={loading || !resumeText}
              className={cn(
                "w-full mt-4 py-3 px-6 rounded-lg font-bold text-white transition-all transform hover:scale-105 active:scale-95",
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg"
              )}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" /> Roasting...
                </span>
              ) : (
                "🔥 ROAST ME"
              )}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="relative min-h-[400px]">
           {roast ? (
             <motion.div
               initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
               animate={{ opacity: 1, scale: 1, rotate: 0 }}
               className="bg-black text-white p-8 rounded-xl shadow-2xl border-4 border-orange-500 relative h-full flex flex-col"
             >
                <div className="absolute -top-4 -right-4 bg-red-600 text-white px-4 py-1 rounded-full font-bold transform rotate-12 shadow-lg">
                  EMOTIONAL DAMAGE
                </div>
                <h3 className="text-2xl font-bold mb-4 text-orange-400 border-b border-gray-700 pb-2">The Verdict</h3>
                <div className="prose prose-invert max-w-none flex-grow overflow-auto whitespace-pre-wrap">
                  {roast}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center">
                  <span className="text-gray-400 text-sm">bloom-career.ai</span>
                  <button className="flex items-center gap-2 text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors">
                    <Share2 className="w-4 h-4" /> Share Shame
                  </button>
                </div>
             </motion.div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 p-8 text-center">
                <Flame className="w-16 h-16 text-gray-300 mb-4" />
                <p>Your roast will appear here.</p>
                <p className="text-sm">Warning: Not for the faint of heart.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
