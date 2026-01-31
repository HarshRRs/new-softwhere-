'use client'

import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { User } from '@supabase/supabase-js'

export default function AuthButton({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push('/')
  }

  if (!user) {
    return (
      <Link href="/login">
         <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-black text-white hover:bg-gray-800">
           Sign In
         </button>
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-600 hidden md:inline-block">
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  )
}
