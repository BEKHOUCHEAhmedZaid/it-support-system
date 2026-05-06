'use client'
import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  onUploaded: (url: string) => void
}

export function ScreenshotUpload({ userId, onUploaded }: Props) {
  const [dragOver, setDragOver]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview]     = useState<string | null>(null)
  const [error, setError]         = useState<string | null>(null)

  const upload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Seules les images sont acceptées.')
      return
    }
    setUploading(true)
    setError(null)

    const supabase = createClient()
    const path     = `${userId}/${Date.now()}_${file.name}`
    const { data, error: upErr } = await supabase.storage
      .from('screenshots')
      .upload(path, file, { upsert: true })

    if (upErr) {
      setError(upErr.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('screenshots')
      .getPublicUrl(data.path)

    setPreview(publicUrl)
    onUploaded(publicUrl)
    setUploading(false)
  }, [userId, onUploaded])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }, [upload])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Capture d&#39;écran du bug</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer
          ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Aperçu" className="max-h-40 rounded-lg object-contain" />
        ) : (
          <>
            <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <p className="text-sm text-gray-500">
              {uploading ? 'Téléversement…' : 'Glissez-déposez ou cliquez pour sélectionner une image'}
            </p>
          </>
        )}
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
