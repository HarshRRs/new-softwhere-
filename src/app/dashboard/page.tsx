import ApplicationHeatmap from '@/components/dashboard/ApplicationHeatmap'
import CompanyInsider from '@/components/dashboard/CompanyInsider'

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mission Control</h1>
        <p className="text-gray-500">Track your progress and get inside intel.</p>
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
