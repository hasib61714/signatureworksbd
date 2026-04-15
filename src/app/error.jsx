'use client'

import Link from 'next/link'

export default function Error({ error, reset }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-lg w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0 3.75h.008v.008H12v-.008zm8.25-.75a8.25 8.25 0 11-16.5 0 8.25 8.25 0 0116.5 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          A temporary problem occurred while loading this page. Please try again.
        </p>
        {error?.message && (
          <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-left text-xs text-slate-500">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="rounded-xl bg-gradient-to-r from-gold-500 to-amber-300 px-5 py-3 text-sm font-semibold text-navy-950 transition hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  )
}
