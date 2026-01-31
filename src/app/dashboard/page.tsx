import ApplicationHeatmap from '@/components/dashboard/ApplicationHeatmap'
import CompanyInsider from '@/components/dashboard/CompanyInsider'
import JobList from '@/components/dashboard/JobList'
import KanbanBoard from '@/components/dashboard/KanbanBoard'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Crown } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect('/login')
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mission Control</h1>
          <p className="text-gray-500">Welcome back, {user.email}</p>
        </div>
        <Link href="/pricing">
          <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg hover:shadow-xl transition-transform hover:-translate-y-0.5 flex items-center gap-2">
            <Crown className="w-5 h-5" fill="currentColor" />
            Upgrade to Pro
          </button>
        </Link>
      </div>

      {/* Main Stats Row */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <ApplicationHeatmap />
        </div>
        <div className="md:col-span-1">
           <CompanyInsider />
        </div>
      </div>

      {/* Application Tracker */}
      <KanbanBoard />

      {/* Job Feed */}
      <JobList />
    </div>
  )
}
