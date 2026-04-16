'use client'

import { useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

function getPreviewType(label = '', value = '') {
  const source = `${label} ${value}`.toLowerCase()
  if (source.includes('video') || value.match(/\.(mp4|webm|ogg|mov)(\?|$)/i)) return 'video'
  if (source.includes('image') || source.includes('cover') || source.includes('before') || source.includes('after') || value.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i)) return 'image'
  return 'link'
}

export default function MediaUploadField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  hint,
  multiline = false,
  rows = 4,
}) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const previewType = getPreviewType(label, value || '')
  const accept = previewType === 'video' ? 'video/*' : 'image/*,video/*'

  const handleUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!supabase) {
      setError('Supabase not configured.')
      return
    }

    setUploading(true)
    setError('')

    const extension = file.name.split('.').pop() || 'bin'
    const folder = file.type.startsWith('video/') ? 'videos' : 'images'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const filePath = `${folder}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('site-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('site-media').getPublicUrl(filePath)
    onChange(data.publicUrl)
    setUploading(false)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const inputCls = className || 'w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/20 transition-colors'

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        {multiline ? (
          <textarea
            rows={rows}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls + ' resize-y'}
            placeholder={placeholder}
            required={required}
          />
        ) : (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={inputCls}
            placeholder={placeholder}
            required={required}
          />
        )}

        <div className="shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleUpload}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full rounded-xl border border-gold-200 bg-gold-50 px-4 py-2.5 text-sm font-semibold text-gold-700 hover:bg-gold-100 disabled:opacity-60 sm:w-auto"
          >
            {uploading ? 'Uploading…' : 'Upload File'}
          </button>
        </div>
      </div>

      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}

      {value && previewType === 'image' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
          <img src={value} alt={label || 'Preview'} className="h-28 w-full rounded-lg object-cover" />
        </div>
      )}

      {value && previewType === 'video' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
          <video src={value} controls className="h-32 w-full rounded-lg object-cover" />
        </div>
      )}
    </div>
  )
}
