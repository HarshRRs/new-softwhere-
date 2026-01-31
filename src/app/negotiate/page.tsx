'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, ArrowRight, CheckCircle, Copy, AlertCircle } from 'lucide-react'

export default function NegotiatePage() {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    baseSalary: '',
    targetSalary: '',
    equity: '',
    benefits: ''
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/negotiate/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Salary Negotiation Coach</h1>
        <p className="text-gray-600">Don&apos;t leave money on the table. Get a data-backed strategy.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Input Form */}
        <div className="bg-white p-8 rounded-2xl border shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Offer Details
          </h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <input
                      className="w-full border rounded-lg p-2"
                      placeholder="Senior Dev"
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Company</label>
                    <input
                      className="w-full border rounded-lg p-2"
                      placeholder="Acme Inc"
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Current Offer</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          className="w-full border rounded-lg p-2 pl-7"
                          placeholder="120,000"
                          value={formData.baseSalary}
                          onChange={e => setFormData({...formData, baseSalary: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Target Salary</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">$</span>
                        <input
                          className="w-full border rounded-lg p-2 pl-7"
                          placeholder="140,000"
                          value={formData.targetSalary}
                          onChange={e => setFormData({...formData, targetSalary: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Equity / Stock (Optional)</label>
                <input
                  className="w-full border rounded-lg p-2"
                  placeholder="e.g. 10,000 ISOs or $50k RSUs"
                  value={formData.equity}
                  onChange={e => setFormData({...formData, equity: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Other Benefits / Context</label>
                <textarea
                  className="w-full border rounded-lg p-2 h-24"
                  placeholder="Remote work, 401k match, sign-on bonus..."
                  value={formData.benefits}
                  onChange={e => setFormData({...formData, benefits: e.target.value})}
                />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing...' : 'Generate Strategy'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Output Section */}
        <div className="space-y-6">
           {result ? (
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-6"
             >
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
                   <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                     <AlertCircle className="w-5 h-5" /> Strategy Plan
                   </h3>
                   <div className="prose prose-sm text-blue-800 whitespace-pre-wrap">
                     {result.strategy}
                   </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                   <div className="bg-gray-100 px-6 py-3 border-b flex justify-between items-center">
                      <h3 className="font-bold text-gray-700">Counter-Offer Email</h3>
                      <button
                        onClick={() => navigator.clipboard.writeText(result.email)}
                        className="text-sm text-gray-500 hover:text-black flex items-center gap-1"
                      >
                        <Copy className="w-4 h-4" /> Copy
                      </button>
                   </div>
                   <div className="p-6 font-mono text-sm whitespace-pre-wrap bg-white">
                     {result.email}
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50/50 p-12 text-center">
                <DollarSign className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-lg font-medium">Your negotiation playbook will appear here.</p>
                <ul className="text-sm text-left mt-6 space-y-2 max-w-xs mx-auto">
                   <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Custom email script</li>
                   <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Leverage points analysis</li>
                   <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Tone check</li>
                </ul>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
