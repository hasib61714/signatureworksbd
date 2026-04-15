'use client'

export default function GlobalError() {
  return (
    <html>
      <body>
        <main className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
          <div className="max-w-lg w-full rounded-3xl border border-white/10 bg-slate-900 p-8 text-center">
            <h1 className="text-2xl font-bold text-white">Application error</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              An unexpected error occurred. Please refresh the page.
            </p>
          </div>
        </main>
      </body>
    </html>
  )
}
