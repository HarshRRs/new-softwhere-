'use client'

import { motion } from 'framer-motion'

const generateMockData = () => {
  const data = []
  const today = new Date()
  for (let i = 0; i < 90; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    // Random status
    const rand = Math.random()
    let status = 'none'
    if (rand > 0.8) status = 'applied'
    if (rand > 0.95) status = 'interview'
    if (rand > 0.99) status = 'offer'

    data.push({ date, status })
  }
  return data.reverse()
}

export default function ApplicationHeatmap() {
  const data = generateMockData()

  const getColor = (status: string) => {
    switch (status) {
      case 'offer': return 'bg-green-500'
      case 'interview': return 'bg-purple-500'
      case 'applied': return 'bg-blue-400'
      default: return 'bg-gray-100'
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-lg mb-4">Application Activity</h3>
      <div className="flex flex-wrap gap-1">
        {data.map((day, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.005 }}
            className={`w-3 h-3 rounded-sm ${getColor(day.status)}`}
            title={`${day.date.toLocaleDateString()}: ${day.status}`}
          />
        ))}
      </div>
      <div className="flex gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 rounded-sm"></div> No Activity</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-400 rounded-sm"></div> Applied</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-purple-500 rounded-sm"></div> Interview</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-500 rounded-sm"></div> Offer</div>
      </div>
    </div>
  )
}
