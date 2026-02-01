'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, BrainCircuit, Activity, AlertTriangle, Lightbulb, Sun, Moon } from 'lucide-react'
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
  const [darkMode, setDarkMode] = useState(false) // Default to Light Mode per request

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
    <div className={cn(
        "min-h-screen font-mono p-4 flex flex-col overflow-hidden transition-colors duration-300",
        darkMode ? "bg-black text-green-500" : "bg-white text-gray-900"
    )}>
      {/* Header */}
      <div className={cn("flex justify-between items-center border-b pb-4 mb-4", darkMode ? "border-green-900" : "border-gray-200")}>
        <div className="flex items-center gap-2">
          <BrainCircuit className={cn("w-6 h-6 animate-pulse", darkMode ? "text-green-500" : "text-purple-600")} />
          <h1 className="text-xl font-bold tracking-widest">INTERVIEW COPILOT_v1</h1>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
            onClick={toggleListening}
            className={cn(
                "p-3 rounded-full border transition-all",
                isListening
                    ? "bg-red-500 text-white border-red-600 animate-pulse shadow-lg"
                    : darkMode
                        ? "border-green-500/50 hover:bg-green-900/30"
                        : "border-gray-300 hover:bg-gray-100"
            )}
            >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
        </div>
      </div>

      {/* Live Audio Viz (Fake) */}
      <div className={cn("h-12 flex items-center justify-center gap-1 mb-4 opacity-50", darkMode ? "text-green-500" : "text-purple-500")}>
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={cn("w-1", darkMode ? "bg-green-500" : "bg-purple-500")}
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
              <div className={cn("flex items-center justify-center gap-2 mb-4", darkMode ? "text-yellow-400" : "text-amber-600")}>
                <AlertTriangle className="w-5 h-5" />
                <span className="uppercase text-sm tracking-widest">Detected: {activeKeyword}</span>
              </div>

              {suggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                      "p-4 rounded-lg text-lg font-sans text-left shadow-lg",
                      darkMode
                        ? "bg-green-900/20 border border-green-500/30 text-white shadow-[0_0_15px_rgba(0,255,0,0.1)]"
                        : "bg-white border border-gray-200 text-gray-800"
                  )}
                >
                  <Lightbulb className={cn("w-4 h-4 inline mr-2", darkMode ? "text-yellow-400" : "text-amber-500")} />
                  {suggestion}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className={cn("flex flex-col items-center", darkMode ? "text-green-800" : "text-gray-400")}>
              <Activity className="w-16 h-16 mb-4 opacity-20" />
              <p>Listening for interview questions...</p>
              <p className="text-xs mt-2">Try saying &quot;What is your biggest weakness?&quot;</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript Feed (Subtitles) */}
      <div className={cn("h-24 border-t pt-4 mt-4 text-sm overflow-hidden relative", darkMode ? "border-green-900 text-green-700" : "border-gray-200 text-gray-500")}>
        <div className={cn("absolute inset-0 bg-gradient-to-t via-transparent to-transparent pointer-events-none", darkMode ? "from-black" : "from-white")}></div>
        <p className="whitespace-pre-wrap break-words opacity-70">
          {transcript || "> System Ready. Waiting for audio input..."}
        </p>
      </div>
    </div>
  )
}
