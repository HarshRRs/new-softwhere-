'use client'

import { useState } from 'react'
import { Sparkles, Download, Plus, Trash2, Upload, Loader2 } from 'lucide-react'
import { extractTextFromPdf } from '@/utils/pdf-helper'

export default function BuilderPage() {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    summary: ''
  })

  const [experience, setExperience] = useState([
    { id: 1, company: '', role: '', startDate: '', endDate: '', description: '' }
  ])

  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    try {
        const text = await extractTextFromPdf(file)

        // Very basic parsing heuristic for MVP
        // In production, we'd use an LLM to structure this text into JSON
        setPersonalInfo(prev => ({
            ...prev,
            summary: text.substring(0, 500) + "..."
        }))

        alert("Resume imported! We've extracted the text into the summary. Use 'AI Enhance' to structure it.")
    } catch (error) {
        console.error("Import failed", error)
    } finally {
        setImporting(false)
    }
  }

  const handleEnhance = async (index: number) => {
    const item = experience[index]
    if (!item.role || !item.company) {
      alert("Please fill in role and company first.")
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enhance_experience',
          data: { role: item.role, company: item.company, description: item.description }
        }),
      })
      const data = await response.json()

      const newExperience = [...experience]
      newExperience[index].description = data.enhancedText
      setExperience(newExperience)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const addExperience = () => {
    setExperience([...experience, { id: Date.now(), company: '', role: '', startDate: '', endDate: '', description: '' }])
  }

  const removeExperience = (id: number) => {
    setExperience(experience.filter(e => e.id !== id))
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 grid md:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
      {/* Editor Column */}
      <div className="overflow-y-auto pr-4 space-y-8 pb-20">

        {/* Import Header */}
        <div className="flex justify-between items-center bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div>
                <h3 className="font-bold text-purple-900">Start from PDF</h3>
                <p className="text-xs text-purple-700">Import your existing resume</p>
            </div>
            <div>
                <input
                   type="file"
                   accept=".pdf"
                   onChange={handleImport}
                   className="hidden"
                   id="builder-upload"
                 />
                 <label
                    htmlFor="builder-upload"
                    className="cursor-pointer bg-white text-purple-700 px-4 py-2 rounded-md text-sm font-bold border border-purple-200 hover:bg-purple-100 flex items-center gap-2"
                 >
                    {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    Import
                 </label>
            </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Personal Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Full Name"
              className="border p-2 rounded"
              value={personalInfo.fullName}
              onChange={e => setPersonalInfo({...personalInfo, fullName: e.target.value})}
            />
            <input
              placeholder="Email"
              className="border p-2 rounded"
              value={personalInfo.email}
              onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})}
            />
            <input
              placeholder="Phone"
              className="border p-2 rounded"
              value={personalInfo.phone}
              onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})}
            />
            <input
              placeholder="LinkedIn URL"
              className="border p-2 rounded"
              value={personalInfo.linkedin}
              onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})}
            />
          </div>
          <textarea
            placeholder="Professional Summary"
            className="w-full border p-2 rounded h-24"
            value={personalInfo.summary}
            onChange={e => setPersonalInfo({...personalInfo, summary: e.target.value})}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-bold">Experience</h2>
            <button onClick={addExperience} className="text-sm flex items-center gap-1 text-blue-600 font-medium">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>

          {experience.map((exp, index) => (
            <div key={exp.id} className="bg-gray-50 p-4 rounded-lg space-y-3 border">
              <div className="flex justify-between">
                 <h3 className="font-semibold text-gray-700">Position {index + 1}</h3>
                 <button onClick={() => removeExperience(exp.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="Job Title"
                  className="border p-2 rounded"
                  value={exp.role}
                  onChange={e => {
                    const newExp = [...experience];
                    newExp[index].role = e.target.value;
                    setExperience(newExp);
                  }}
                />
                <input
                  placeholder="Company"
                  className="border p-2 rounded"
                  value={exp.company}
                  onChange={e => {
                    const newExp = [...experience];
                    newExp[index].company = e.target.value;
                    setExperience(newExp);
                  }}
                />
                 <input
                  placeholder="Start Date"
                  className="border p-2 rounded"
                  value={exp.startDate}
                  onChange={e => {
                    const newExp = [...experience];
                    newExp[index].startDate = e.target.value;
                    setExperience(newExp);
                  }}
                />
                <input
                  placeholder="End Date"
                  className="border p-2 rounded"
                  value={exp.endDate}
                  onChange={e => {
                    const newExp = [...experience];
                    newExp[index].endDate = e.target.value;
                    setExperience(newExp);
                  }}
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder="Description (Bullet points)"
                  className="w-full border p-2 rounded h-32 text-sm"
                  value={exp.description}
                  onChange={e => {
                    const newExp = [...experience];
                    newExp[index].description = e.target.value;
                    setExperience(newExp);
                  }}
                />
                <button
                  onClick={() => handleEnhance(index)}
                  disabled={loading}
                  className="absolute bottom-2 right-2 bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 hover:bg-purple-700 shadow-sm transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  {loading ? 'Enhancing...' : 'AI Enhance'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview Column */}
      <div className="bg-gray-100 p-8 overflow-y-auto hidden md:block rounded-xl border shadow-inner">
        <div className="bg-white shadow-lg p-8 min-h-[800px] w-full max-w-[21cm] mx-auto text-sm" id="resume-preview">
          {/* Resume Header */}
          <div className="text-center border-b-2 border-gray-800 pb-4 mb-6">
            <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{personalInfo.fullName || 'Your Name'}</h1>
            <div className="flex justify-center gap-4 text-gray-600 text-xs">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
            </div>
          </div>

          {/* Summary */}
          {personalInfo.summary && (
            <div className="mb-6">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Professional Summary</h2>
              <p className="text-gray-800 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          <div className="mb-6">
             <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Experience</h2>
             <div className="space-y-6">
               {experience.map(exp => (
                 <div key={exp.id}>
                   <div className="flex justify-between items-baseline mb-1">
                     <h3 className="font-bold text-lg">{exp.role || 'Job Title'}</h3>
                     <span className="text-gray-500 font-medium text-xs">{exp.startDate} - {exp.endDate}</span>
                   </div>
                   <div className="text-gray-600 font-medium mb-2">{exp.company || 'Company Name'}</div>
                   <div className="text-gray-700 whitespace-pre-wrap pl-4 border-l-2 border-gray-200">
                     {exp.description || '• Responsibilities and achievements...'}
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="mt-4 flex justify-center">
             <button
               onClick={() => window.print()}
               className="bg-black text-white px-6 py-2 rounded-full flex items-center gap-2 hover:bg-gray-800"
             >
               <Download className="w-4 h-4" /> Download PDF
             </button>
        </div>
      </div>
    </div>
  )
}
