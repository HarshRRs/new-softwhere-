'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, BrainCircuit, Activity, AlertTriangle, Lightbulb } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// Mock database of "Cheat Sheet" answers triggered by keywords
const CHEAT_SHEET: Record<string, string[]> = {
  "weakness": [
    "I sometimes focus too much on details -> But I use time-boxing now.",
    "I struggle saying no -> I'm learning to prioritize impact.",
    "Public speaking -> I joined Toastmasters."
  ],
  "salary": [
    "Reflect the question back: 'What is the budget for this role?'",
    "Don't give a number first.",
    "Market rate for Senior React is $140k-$180k."
  ],
  "tell me about yourself": [
    "Present -> Past -> Future structure.",
    "Mention your current role and a big win.",
    "Briefly touch on background.",
    "Why you want THIS job."
  ],
  "challenge": [
    "STAR Method: Situation, Task, Action, Result.",
    "Focus on the 'Action' YOU took.",
    "Mention a technical conflict you resolved."
  ],
  "react": [
    "Virtual DOM diffing algorithm.",
    "Hooks (useEffect, useState) logic.",
    "Server Components vs Client Components."
  ]
}

export default function CopilotPage() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interimTranscript += event.results[i][0].transcript
        }

        const text = interimTranscript.toLowerCase()
        setTranscript(text)

        // Inline analysis to avoid dependency loop in useEffect
        for (const [key, answers] of Object.entries(CHEAT_SHEET)) {
            if (text.includes(key)) {
                setActiveKeyword(key)
                setSuggestions(answers)
                return
            }
        }
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    } else {
      try {
        recognitionRef.current?.start()
        setIsListening(true)
        setTranscript('')
        setSuggestions([])
        setActiveKeyword(null)
      } catch (e) {
        console.error(e)
      }
    }
  }

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-green-900 pb-4 mb-4">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 animate-pulse" />
          <h1 className="text-xl font-bold tracking-widest">INTERVIEW COPILOT_v1</h1>
        </div>
        <button
          onClick={toggleListening}
          className={cn(
            "p-3 rounded-full border border-green-500/50 transition-all hover:bg-green-900/30",
            isListening ? "animate-pulse bg-red-900/50 border-red-500 text-red-500" : ""
          )}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>

      {/* Live Audio Viz (Fake) */}
      <div className="h-12 flex items-center justify-center gap-1 mb-4 opacity-50">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-green-500"
            animate={{ height: isListening ? [5, 20, 5] : 2 }}
            transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
          />
        ))}
      </div>

      {/* Main Suggestion Area */}
      <div className="flex-1 relative flex flex-col justify-center items-center text-center">
        <AnimatePresence mode="wait">
          {activeKeyword ? (
            <motion.div
              key={activeKeyword}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-lg space-y-6"
            >
              <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
                <AlertTriangle className="w-5 h-5" />
                <span className="uppercase text-sm tracking-widest">Detected: {activeKeyword}</span>
              </div>

              {suggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg text-lg text-white font-sans text-left shadow-[0_0_15px_rgba(0,255,0,0.1)]"
                >
                  <Lightbulb className="w-4 h-4 text-yellow-400 inline mr-2" />
                  {suggestion}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-green-800 flex flex-col items-center">
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p>Listening for interview questions...</p>
              <p className="text-xs mt-2">Try saying &quot;What is your biggest weakness?&quot;</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript Feed (Subtitles) */}
      <div className="h-24 border-t border-green-900 pt-4 mt-4 text-sm text-green-700 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none"></div>
        <p className="whitespace-pre-wrap break-words opacity-70">
          {transcript || "> System Ready. Waiting for audio input..."}
        </p>
      </div>
    </div>
  )
}
