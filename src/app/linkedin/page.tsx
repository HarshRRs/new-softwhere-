'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Sparkles, Copy, Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function LinkedInPage() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('Professional')
  const [posts, setPosts] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!topic) return
    setLoading(true)
    try {
      const response = await fetch('/api/linkedin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      })
      const data = await response.json()
      setPosts(data.posts)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 flex justify-center items-center gap-3">
          <Linkedin className="w-10 h-10 text-[#0077b5]" />
          LinkedIn Growth Engine
        </h1>
        <p className="text-gray-600">Turn your thoughts into viral opportunities. Build your personal brand.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">What do you want to talk about?</label>
            <input
              className="w-full border rounded-lg p-3"
              placeholder="e.g. My first week as a Senior Dev, Why AI won't replace us..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium mb-1">Tone</label>
            <select
              className="w-full border rounded-lg p-3 bg-white"
              value={tone}
              onChange={e => setTone(e.target.value)}
            >
              <option>Professional</option>
              <option>Storytelling</option>
              <option>Controversial</option>
              <option>Educational</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading || !topic}
              className="w-full md:w-auto bg-[#0077b5] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#006097] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative group"
          >
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-gray-200"></div>
               <div>
                 <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
                 <div className="h-3 w-16 bg-gray-100 rounded"></div>
               </div>
            </div>

            <div className="whitespace-pre-wrap text-sm text-gray-800 mb-12 font-sans">
              {post}
            </div>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button
                 onClick={() => copyToClipboard(post, i)}
                 className={cn(
                   "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all",
                   copiedIndex === i
                     ? "bg-green-100 text-green-700"
                     : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                 )}
               >
                 {copiedIndex === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                 {copiedIndex === i ? "Copied" : "Copy"}
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
