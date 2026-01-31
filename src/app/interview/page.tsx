'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Send, Briefcase, Heart, Cpu, Mic, Volume2, MicOff, VolumeX, HandCoins } from 'lucide-react'
import { cn } from '@/lib/utils'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const PERSONAS = [
  {
    id: 'tech-lead',
    name: 'Tough Tech Lead',
    description: 'Skeptical. Grills you on code.',
    icon: Cpu,
    color: 'text-blue-500',
    systemPrompt: "You are a skeptical, grumpy Senior Tech Lead conducting a technical interview. You value deep understanding, optimization, and clean code. Don't accept vague answers. Challenge the candidate. Keep responses concise.",
    voicePitch: 0.8,
    voiceRate: 1.0
  },
  {
    id: 'hr',
    name: 'Friendly HR',
    description: 'Warm. Focuses on culture fit.',
    icon: Heart,
    color: 'text-pink-500',
    systemPrompt: "You are a warm, welcoming HR Manager. You care about culture fit, soft skills, and career goals. Be encouraging but ask behavioral questions (STAR method). Keep responses concise.",
    voicePitch: 1.2,
    voiceRate: 1.1
  },
  {
    id: 'founder',
    name: 'Intense Founder',
    description: 'Fast-paced. Obsessed with impact.',
    icon: Briefcase,
    color: 'text-orange-500',
    systemPrompt: "You are a startup founder. You move fast. You care about impact, ownership, and hustle. You don't care about processes. You want to know if the candidate can ship. Keep responses concise and energetic.",
    voicePitch: 1.0,
    voiceRate: 1.25
  },
  {
    id: 'negotiator',
    name: 'Tough Negotiator',
    description: 'Firm on budget. Needs convincing.',
    icon: HandCoins,
    color: 'text-green-600',
    systemPrompt: "You are a Hiring Manager negotiating a salary. You have a budget but really want the candidate. You start by saying the offer is competitive. If the candidate makes good points about market rate or value, concede slightly. Be firm but professional. Keep responses concise.",
    voicePitch: 0.9,
    voiceRate: 1.0
  }
]

// Add proper types for Web Speech API
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

interface SpeechRecognitionErrorEvent {
  error: string
}

function InterviewContent() {
  const searchParams = useSearchParams()
  const initialPersonaId = searchParams.get('persona')
  const [selectedPersona, setSelectedPersona] = useState(PERSONAS[0])

  useEffect(() => {
    if (initialPersonaId) {
        const found = PERSONAS.find(p => p.id === initialPersonaId)
        if (found) setSelectedPersona(found)
    }
  }, [initialPersonaId])

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<unknown>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize Speech Recognition
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = recognitionRef.current as any
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript
        setInput(prev => prev + ' ' + transcript)
        setIsRecording(false)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
      }
    }
  }, [])

  const toggleRecording = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = recognitionRef.current as any
    if (isRecording) {
      recognition?.stop()
    } else {
      if (recognition) {
         try {
           recognition.start()
           setIsRecording(true)
         } catch (e) {
            console.error(e)
         }
      } else {
        alert("Speech recognition not supported in this browser.")
      }
    }
  }

  const speakText = (text: string) => {
    if (!soundEnabled || typeof window === 'undefined') return

    // Cancel current speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.pitch = selectedPersona.voicePitch
    utterance.rate = selectedPersona.voiceRate

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages,
          persona: selectedPersona.systemPrompt
        }),
      })
      const data = await response.json()
      const reply = data.reply
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      speakText(reply)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const startInterview = () => {
    const greeting = `Hello. I'm the ${selectedPersona.name}. Let's get started.`
    setMessages([{ role: 'assistant', content: greeting }])
    speakText(greeting)
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <h1 className="text-2xl font-bold">Mock Interview</h1>
        <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={cn("p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors", !soundEnabled && "text-gray-400")}
              title={soundEnabled ? "Mute AI" : "Unmute AI"}
            >
               {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              {PERSONAS.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPersona(p); setMessages([]); window.speechSynthesis.cancel() }}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all",
                    selectedPersona.id === p.id ? "bg-white shadow-sm text-black" : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <p.icon className={cn("w-4 h-4", p.color)} />
                  <span className="hidden sm:inline">{p.name}</span>
                </button>
              ))}
            </div>
        </div>
      </div>

      <div className="flex-1 bg-white border rounded-xl shadow-sm flex flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className={cn("p-4 rounded-full bg-gray-50 relative", selectedPersona.color)}>
              <selectedPersona.icon className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold">Ready to practice with {selectedPersona.name}?</h2>
            <p className="text-gray-500 max-w-md">{selectedPersona.description}</p>
            <button
              onClick={startInterview}
              className="bg-black text-white px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              Start Interview
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex gap-3", m.role === 'user' ? "justify-end" : "justify-start")}>
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm flex-shrink-0 relative overflow-hidden">
                      <selectedPersona.icon className="w-4 h-4 text-gray-600 relative z-10" />
                       {isSpeaking && i === messages.length - 1 && (
                          <div className="absolute inset-0 bg-green-200 animate-pulse z-0 opacity-50"></div>
                       )}
                    </div>
                  )}
                  <div className={cn(
                    "max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm",
                    m.role === 'user' ? "bg-blue-600 text-white rounded-br-none" : "bg-white border text-gray-800 rounded-bl-none"
                  )}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                 <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center shadow-sm flex-shrink-0">
                      <selectedPersona.icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-white border px-4 py-2 rounded-2xl rounded-bl-none shadow-sm text-gray-400 text-sm">
                      Thinking...
                    </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <button
                  onClick={toggleRecording}
                  className={cn(
                    "p-3 rounded-full transition-all border",
                    isRecording
                      ? "bg-red-500 text-white border-red-600 animate-pulse"
                      : "bg-white text-gray-500 hover:bg-gray-100 border-gray-200"
                  )}
                  title="Toggle Microphone"
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={isRecording ? "Listening..." : "Type your answer..."}
                  className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function InterviewPage() {
  return (
    <Suspense fallback={<div>Loading interview...</div>}>
      <InterviewContent />
    </Suspense>
  )
}
