'use client'

import { Check, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const TIERS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    description: 'Get your resume ready for war.',
    features: [
      'Viral Resume Roaster',
      'AI Resume Builder',
      'Smart Profile Parsing',
      'LinkedIn Content Generator'
    ],
    notIncluded: [
      'Backdoor Auto-Apply Engine',
      'Interview Copilot (Cheat Mode)',
      'Salary Negotiation Coach',
      'Unlimited Job Tracking'
    ],
    cta: 'Start Free',
    popular: false
  },
  {
    name: 'Pro',
    price: '€49',
    period: '/month',
    description: 'Bypass the application queue completely.',
    features: [
      'Everything in Starter',
      'Backdoor Auto-Apply (Cold DMs)',
      'Interview Copilot (Real-time)',
      'Salary Negotiation Coach',
      'Unlimited Cover Letter AI'
    ],
    notIncluded: [],
    cta: 'Get Unfair Advantage',
    popular: true,
    highlight: 'Killer Deal'
  },
  {
    name: 'Concierge',
    price: '€499',
    period: '/month',
    description: 'We do it all for you. Sit back.',
    features: [
      'Everything in Pro',
      'Human Expert Review',
      'Manual Application Service',
      '1-on-1 Interview Coaching',
      'Success Guarantee'
    ],
    notIncluded: [],
    cta: 'Hire Us to Apply',
    popular: false
  }
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (tierName: string) => {
    setLoading(tierName)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tierName }),
      })
      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Checkout unavailable in demo mode')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold">Destroy the Competition.</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Stop applying like everyone else. Start using &quot;Cheat Mode&quot; for your career.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={cn(
              "relative bg-white rounded-2xl border p-8 flex flex-col shadow-sm transition-all hover:shadow-md",
              tier.popular ? "border-purple-500 ring-2 ring-purple-500 ring-opacity-50 scale-105 z-10" : "border-gray-200"
            )}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide flex items-center gap-1">
                <Zap className="w-4 h-4" fill="currentColor" /> Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">{tier.price}</span>
                <span className="text-gray-500">{tier.period}</span>
              </div>
              <p className="text-gray-500 mt-2 text-sm">{tier.description}</p>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
              {tier.notIncluded.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-400">
                  <X className="w-5 h-5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(tier.name)}
              disabled={loading === tier.name}
              className={cn(
                "w-full py-3 rounded-lg font-bold transition-colors",
                tier.popular
                  ? "bg-purple-600 text-white hover:bg-purple-700 shadow-lg hover:shadow-xl"
                  : "bg-gray-900 text-white hover:bg-gray-800",
                loading === tier.name && "opacity-75 cursor-wait"
              )}
            >
              {loading === tier.name ? 'Processing...' : tier.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
