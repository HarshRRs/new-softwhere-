'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Flame, Loader2, Download, Share2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import RoastCard from '@/components/RoastCard'
import html2canvas from 'html2canvas'

interface RoastData {
  roast: string
  score: number
  cliches: string[]
  oneLiner: string
  animal: string
}

export default function RoastPage() {
  const [resumeText, setResumeText] = useState('')
  const [data, setData] = useState<RoastData | null>(null)
  const [loading, setLoading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleRoast = async () => {
    if (!resumeText) return
    setLoading(true)
    setData(null)

    try {
      const response = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Failed to roast:', error)
      // Fallback
      setData({
        roast: "System Overload. Your resume was too powerful (or generic).",
        score: 1,
        cliches: ["Error", "Try Again"],
        oneLiner: "Even my error logs are more interesting.",
        animal: "Buggy Code"
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadCard = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { scale: 2, backgroundColor: null })
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = 'bloom-roast.png'
    link.click()
  }

  const shareToTwitter = () => {
    if (!data) return
    const text = `I just got roasted by Bloom AI. My resume employability score is ${data.score}/10 💀. "%22${data.oneLiner}%22" \n\nGet yours here: https://bloom-career.ai`
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
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

      <div className="grid md:grid-cols-2 gap-12 items-start">
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
        <div className="flex flex-col items-center">
           {data ? (
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="space-y-6 w-full flex flex-col items-center"
             >
                <div className="relative group">
                  <RoastCard ref={cardRef} {...data} />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-3xl backdrop-blur-sm">
                    <p className="text-white font-bold">Preview Mode</p>
                  </div>
                </div>

                <div className="flex gap-4 w-full max-w-md">
                   <button
                     onClick={downloadCard}
                     className="flex-1 bg-black text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all"
                   >
                     <Download className="w-5 h-5" /> Download
                   </button>
                   <button
                     onClick={shareToTwitter}
                     className="flex-1 bg-[#1DA1F2] text-white py-3 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#1a94df] transition-all"
                   >
                     <Share2 className="w-5 h-5" /> Tweet Shame
                   </button>
                </div>

                <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl w-full max-w-md">
                   <h3 className="font-bold text-orange-900 mb-2">Detailed Roast</h3>
                   <p className="text-orange-800 text-sm leading-relaxed">{data.roast}</p>
                </div>

             </motion.div>
           ) : (
             <div className="w-full h-[500px] flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50/50 p-8 text-center">
                <Flame className="w-16 h-16 text-gray-300 mb-4" />
                <p>Your roast card will generate here.</p>
                <p className="text-sm">Warning: Not for the faint of heart.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
