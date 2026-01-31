import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import AuthButton from '@/components/auth/AuthButton'
import { createClient } from '@/utils/supabase/server'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center max-w-7xl mx-auto px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="hidden font-bold sm:inline-block">
              Bloom
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/roast" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Resume Roast
            </Link>
            <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Dashboard
            </Link>
             <Link href="/interview" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Interview Coach
            </Link>
            <Link href="/negotiate" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Negotiate
            </Link>
            <Link href="/linkedin" className="transition-colors hover:text-foreground/80 text-foreground/60">
              LinkedIn
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           <AuthButton user={user} />
        </div>
      </div>
    </nav>
  )
}
