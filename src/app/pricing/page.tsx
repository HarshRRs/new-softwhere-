'use client'

import { Check, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const TIERS = [
  {
    name: 'Basic',
    price: '€29',
    period: '/month',
    description: 'For casual job seekers.',
    features: [
      'Resume Generator',
      'Cover Letter Generator',
      '50 Applications / mo',
      'Basic Tracking'
    ],
    notIncluded: [
      'Auto-Apply Engine',
      'Interview Coach',
      'Salary Negotiation AI',
      'LinkedIn Autopilot'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '€79',
    period: '/month',
    description: 'For serious candidates who want results fast.',
    features: [
      'Everything in Basic',
      'Auto-Apply to 100 jobs/day',
      'Interview Prep AI',
      'Salary Negotiation Coach',
      'LinkedIn Autopilot'
    ],
    notIncluded: [],
    cta: 'Upgrade to Pro',
    popular: true
  },
  {
    name: 'Success-Based',
    price: '€0',
    period: ' upfront',
    description: 'We only get paid when you get hired.',
    features: [
      'Everything in Pro',
      'Priority Support',
      'Personal Success Manager',
      'Pay 10% of 1st year salary LATER'
    ],
    notIncluded: [],
    cta: 'Apply for Program',
    popular: false,
    highlight: 'Risk Free'
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
        <h1 className="text-4xl md:text-5xl font-bold">Invest in Your Future</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your ambition. From automated applications to full-service career management.
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
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                Most Popular
              </div>
            )}
            {tier.highlight && (
               <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                {tier.highlight}
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
                  <span>{feature}</span>
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
                  ? "bg-purple-600 text-white hover:bg-purple-700"
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
