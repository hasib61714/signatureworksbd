'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const BUCKET = 'site-media'
const FILE_TYPES = { all: 'All', image: 'Images', video: 'Videos', pdf: 'PDFs', other: 'Other' }

function getFileType(name) {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'].includes(ext)) return 'image'
  if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'video'
  if (ext === 'pdf') return 'pdf'
  return 'other'
}

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function getPublicUrl(path) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`
}

export default function MediaPage() {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(null)
  const [copied, setCopied] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => { fetchFiles() }, [])

  async function fetchFiles() {
    setLoading(true)
    if (!supabase) { setLoading(false); return }
    const { data, error } = await supabase.storage.from(BUCKET).list('', { limit: 500, sortBy: { column: 'created_at', order: 'desc' } })
    if (!error && data) setFiles(data.filter(f => f.name !== '.emptyFolderPlaceholder'))
    setLoading(false)
  }

  async function handleUpload(e) {
    const selectedFiles = Array.from(e.target.files)
    if (!selectedFiles.length) return
    setUploading(true)
    setError('')
    for (const file of selectedFiles) {
      const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      setUploadProgress(safeName)
      const { error } = await supabase.storage.from(BUCKET).upload(safeName, file, { upsert: false })
      if (error) setError(`Upload failed: ${error.message}`)
    }
    setUploadProgress(null)
    setUploading(false)
    fileInputRef.current.value = ''
    fetchFiles()
  }

  async function handleDelete(name) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(name)
    const { error } = await supabase.storage.from(BUCKET).remove([name])
    if (error) setError(`Delete failed: ${error.message}`)
    else setFiles(prev => prev.filter(f => f.name !== name))
    setDeleting(null)
  }

  function copyUrl(path) {
    const url = getPublicUrl(path)
    navigator.clipboard.writeText(url)
    setCopied(path)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = filter === 'all' ? files : files.filter(f => getFileType(f.name) === filter)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-500 text-sm mt-1">Images, videos, PDFs — সব upload ও manage করুন।</p>
        </div>
        <label className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-colors ${uploading ? 'bg-gray-300 text-gray-500' : 'bg-gold-500 text-navy-950 hover:bg-gold-400'}`}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          {uploading ? (uploadProgress ? `Uploading ${uploadProgress}…` : 'Uploading…') : 'Upload Files'}
          <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleUpload} disabled={uploading} accept="image/*,video/*,.pdf,.doc,.docx" />
        </label>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-sm text-rose-700">{error}</div>}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {Object.entries(FILE_TYPES).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {label} {key !== 'all' && `(${files.filter(f => getFileType(f.name) === key).length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">No files here yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map(file => {
            const type = getFileType(file.name)
            const url = getPublicUrl(file.name)
            return (
              <div key={file.name} className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-square bg-gray-100 relative cursor-pointer" onClick={() => setPreview({ file, url, type })}>
                  {type === 'image' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : type === 'video' ? (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <svg className="w-8 h-8 text-white opacity-70" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                  ) : type === 'pdf' ? (
                    <div className="w-full h-full flex items-center justify-center bg-red-50">
                      <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="p-2 space-y-1.5">
                  <p className="text-[10px] text-gray-600 truncate font-medium" title={file.name}>{file.name}</p>
                  <p className="text-[9px] text-gray-400">{formatSize(file.metadata?.size)}</p>
                  <div className="flex gap-1">
                    <button onClick={() => copyUrl(file.name)} className={`flex-1 text-[10px] font-semibold py-1 rounded-lg transition-colors ${copied === file.name ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600 hover:bg-gold-50 hover:text-gold-700'}`}>
                      {copied === file.name ? 'Copied!' : 'Copy URL'}
                    </button>
                    <button onClick={() => handleDelete(file.name)} disabled={deleting === file.name} className="px-2 py-1 text-[10px] font-semibold rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50">
                      {deleting === file.name ? '…' : 'Del'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Preview modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              Close
            </button>
            {preview.type === 'image' && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt={preview.file.name} className="w-full rounded-xl max-h-[80vh] object-contain bg-black" />
            )}
            {preview.type === 'video' && (
              <video src={preview.url} controls className="w-full rounded-xl max-h-[80vh]" />
            )}
            <div className="bg-slate-900 rounded-xl mt-2 p-3 flex items-center gap-3">
              <p className="text-white text-xs font-mono flex-1 break-all opacity-70">{preview.url}</p>
              <button onClick={() => copyUrl(preview.file.name)} className="shrink-0 px-3 py-1.5 rounded-lg bg-gold-500 text-navy-950 text-xs font-semibold hover:bg-gold-400 transition-colors">
                {copied === preview.file.name ? 'Copied!' : 'Copy URL'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
