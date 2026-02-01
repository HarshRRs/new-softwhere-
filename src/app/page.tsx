import Link from 'next/link'
import { ArrowRight, CheckCircle, Zap } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center mx-auto px-4">
          <Link
            href="/roast"
            className="rounded-2xl bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-900 transition-colors hover:bg-purple-200"
          >
            🔥 New: AI Resume Roaster
          </Link>
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 pb-2">
            Get Hired. <br className="hidden md:inline" />
            Faster than ever.
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 text-gray-600">
            Bloom is your AI career ally. Auto-apply to jobs, get brutally honest resume feedback, and practice interviews with real personas.
          </p>
          <div className="space-x-4">
            <Link href="/login">
               <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-800 h-11 px-8 py-2">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
               </button>
            </Link>
             <Link href="/roast">
               <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8 py-2 border-gray-300 hover:bg-gray-100">
                Roast My Resume
               </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container space-y-6 bg-slate-50 py-8 md:py-12 lg:py-24 mx-auto px-4 max-w-7xl rounded-xl">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
            Features
          </h2>
          <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7 text-gray-600">
            Everything you need to land your dream job, powered by advanced AI.
          </p>
        </div>
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Zap className="h-12 w-12 text-purple-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Resume Roaster</h3>
                <p className="text-sm text-gray-500">Get brutal, viral-worthy feedback on your resume instantly.</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div className="space-y-2">
                <h3 className="font-bold">Auto-Apply</h3>
                <p className="text-sm text-gray-500">Track applications and generate cover letters in one click.</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <div className="flex items-center space-x-2">
                 <span className="text-4xl">🤝</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-bold">Interview Persona</h3>
                <p className="text-sm text-gray-500">Practice with a &quot;Tough Tech Lead&quot; or &quot;Friendly HR&quot;.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
