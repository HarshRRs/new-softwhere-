'use client'

import { forwardRef } from 'react'
import { Sparkles } from 'lucide-react'

interface RoastCardProps {
  score: number
  roast: string
  cliches: string[]
  oneLiner: string
  animal: string
  name?: string
}

const RoastCard = forwardRef<HTMLDivElement, RoastCardProps>(({ score, cliches, oneLiner, animal }, ref) => {

  const getGradient = (score: number) => {
    if (score < 4) return "from-red-900 via-red-800 to-black"
    if (score < 7) return "from-orange-800 via-orange-900 to-black"
    return "from-green-900 via-emerald-900 to-black"
  }

  return (
    <div
      ref={ref}
      className={`relative w-full max-w-md aspect-[4/5] bg-gradient-to-br ${getGradient(score)} text-white p-8 rounded-3xl shadow-2xl flex flex-col justify-between overflow-hidden border-4 border-white/10`}
    >
      {/* Background Noise/Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.5%22/%3E%3C/svg%3E")' }}></div>

      {/* Header */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-yellow-400" />
          <span className="font-bold tracking-wider text-sm opacity-80">BLOOM AI ROAST</span>
        </div>
        <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono">
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6 text-center">
        <div>
          <h2 className="text-6xl font-black mb-2 flex justify-center items-center gap-2" style={{ textShadow: '0 4px 0 rgba(0,0,0,0.5)' }}>
            {score}/10
          </h2>
          <p className="text-xl font-medium opacity-90 uppercase tracking-widest">Employability Score</p>
        </div>

        <div className="bg-black/30 backdrop-blur-sm p-4 rounded-xl border border-white/10 transform -rotate-1">
          <p className="font-serif italic text-lg leading-relaxed">
            &quot;{oneLiner}&quot;
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left">
           <div className="bg-white/5 p-3 rounded-lg">
             <span className="text-xs uppercase text-gray-400 block mb-1">Spirit Animal</span>
             <span className="font-bold text-lg">{animal}</span>
           </div>
           <div className="bg-white/5 p-3 rounded-lg">
             <span className="text-xs uppercase text-gray-400 block mb-1">Cliche Count</span>
             <span className="font-bold text-lg text-red-400">{cliches.length} Detected</span>
           </div>
        </div>
      </div>

      {/* Footer / Cliches */}
      <div className="relative z-10 mt-4">
        <p className="text-xs uppercase text-gray-500 mb-2">Detected Cliches:</p>
        <div className="flex flex-wrap gap-2">
          {cliches.map((c, i) => (
            <span key={i} className="bg-red-500/20 text-red-200 border border-red-500/30 px-2 py-1 rounded text-xs font-mono">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-white/10 text-xs font-bold rotate-90 origin-bottom-right">
        bloom-career.ai
      </div>
    </div>
  )
})

RoastCard.displayName = "RoastCard"

export default RoastCard
