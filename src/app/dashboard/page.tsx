import ApplicationHeatmap from '@/components/dashboard/ApplicationHeatmap'
import CompanyInsider from '@/components/dashboard/CompanyInsider'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
      <div>
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="text-gray-500">Welcome back, {user.email}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
           <ApplicationHeatmap />
        </div>
        <div className="md:col-span-1">
           <CompanyInsider />
        </div>
      </div>

      {/* Placeholder for Job List */}
      <div className="bg-white rounded-xl border shadow-sm p-6 min-h-[300px] flex items-center justify-center text-gray-400">
        <p>Auto-Applied Jobs list will appear here in the next update.</p>
      </div>
    </div>
  )
}
