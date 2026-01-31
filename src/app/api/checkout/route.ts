import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { headers } from 'next/headers'

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null

export async function POST(req: Request) {
  try {
    const { tier } = await req.json()
    const headersList = await headers()
    const origin = headersList.get('origin')

    if (!stripe) {
      // Mock for dev without keys
      return NextResponse.json({ url: `${origin}/dashboard?success=true` })
    }

    // Map tier names to Price IDs (You would replace these strings with actual Stripe Price IDs)
    let priceId = ''
    if (tier === 'Basic') priceId = 'price_basic_id'
    if (tier === 'Pro') priceId = 'price_pro_id'

    // For "Success-Based", it might be a different flow (application form), but for now redirect to dashboard
    if (tier === 'Success-Based') {
         return NextResponse.json({ url: `${origin}/dashboard?applied=true` })
    }

    if (!priceId) {
        return NextResponse.json({ error: 'Invalid Tier' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${origin}/dashboard?success=true`,
      cancel_url: `${origin}/pricing?canceled=true`,
    })

    return NextResponse.json({ url: session.url })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
  }
}
