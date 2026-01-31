'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User, FileText, Upload, Loader2, Check } from 'lucide-react'

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [profile, setProfile] = useState<any>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const supabase = createClient()

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          console.warn(error)
        }

        if (data) setProfile(data)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    getProfile()
  }, [getProfile])

  const handleUpload = async () => {
    if (!resumeFile) return
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', resumeFile)

      const response = await fetch('/api/profile/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        alert('Resume parsed and saved!')
        getProfile() // Refresh data
      } else {
        alert('Upload failed.')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
           <div className="bg-white p-6 rounded-xl border shadow-sm text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                 <User className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="font-bold text-xl">{profile?.full_name || 'User'}</h2>
              <p className="text-gray-500 text-sm">{profile?.job_title || 'Job Seeker'}</p>
           </div>
        </div>

        <div className="md:col-span-2 space-y-6">
           <div className="bg-white p-6 rounded-xl border shadow-sm">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Resume Settings
              </h3>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                 <input
                   type="file"
                   accept=".pdf"
                   onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                   className="hidden"
                   id="resume-upload"
                 />
                 <label htmlFor="resume-upload" className="cursor-pointer block">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700">
                      {resumeFile ? resumeFile.name : 'Upload PDF Resume'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Click to browse</p>
                 </label>
              </div>

              {resumeFile && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="mt-4 w-full bg-black text-white py-2 rounded-lg font-bold hover:bg-gray-800 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {uploading ? 'Parsing...' : 'Save & Parse'}
                </button>
              )}

              {profile?.resume_text && (
                <div className="mt-6">
                  <h4 className="font-semibold text-sm mb-2">Parsed Content Preview:</h4>
                  <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono max-h-40 overflow-y-auto">
                    {profile.resume_text.substring(0, 500)}...
                  </div>
                  <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Resume active. AI will use this for cover letters.
                  </p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
