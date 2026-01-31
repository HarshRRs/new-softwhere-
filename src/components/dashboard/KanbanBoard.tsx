'use client'

import { useState, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

interface Application {
  id: string
  job_title: string
  company: string
  status: 'applied' | 'interviewing' | 'offer' | 'rejected'
  created_at: string
}

const COLUMNS = [
  { id: 'applied', title: 'Applied', color: 'bg-blue-100 text-blue-800' },
  { id: 'interviewing', title: 'Interviewing', color: 'bg-purple-100 text-purple-800' },
  { id: 'offer', title: 'Offer', color: 'bg-green-100 text-green-800' },
  { id: 'rejected', title: 'Rejected', color: 'bg-red-100 text-red-800' },
]

export default function KanbanBoard() {
  const [applications, setApplications] = useState<Application[]>([])
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    const fetchApplications = async () => {
      const { data } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false })

      if (data && mounted) setApplications(data as Application[])
    }
    fetchApplications()
    return () => { mounted = false }
  }, [supabase])

  const updateStatus = async (id: string, newStatus: string) => {
    // Optimistic UI Update
    setApplications(prev => prev.map(app =>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        app.id === id ? { ...app, status: newStatus as any } : app
    ))

    await supabase.from('applications').update({ status: newStatus }).eq('id', id)
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm p-6 overflow-x-auto">
      <h3 className="font-bold text-xl mb-6">Application Tracker</h3>
      <div className="flex gap-4 min-w-[800px]">
        {COLUMNS.map(col => (
          <div key={col.id} className="flex-1 bg-gray-50 rounded-lg p-4 min-h-[300px]">
            <div className={`mb-4 px-3 py-1 rounded-full text-xs font-bold w-fit ${col.color}`}>
              {col.title} ({applications.filter(a => a.status === col.id).length})
            </div>

            <div className="space-y-3">
              {applications
                .filter(app => app.status === col.id)
                .map(app => (
                  <div key={app.id} className="bg-white p-3 rounded shadow-sm border group hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-sm text-gray-800">{app.company}</h4>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{app.job_title}</p>

                    {/* Simple Move Controls for MVP */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {COLUMNS.map(c => c.id !== col.id && (
                            <button
                                key={c.id}
                                onClick={() => updateStatus(app.id, c.id)}
                                className={`w-2 h-2 rounded-full ${c.color.split(' ')[0]} hover:scale-150 transition-transform`}
                                title={`Move to ${c.title}`}
                            />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
