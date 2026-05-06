'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  currentAvatar: string | null
  onUploaded: (url: string) => void
}

export function AvatarUpload({ userId, currentAvatar, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentAvatar)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const supabase = createClient()
    const path = `${userId}/avatar_${Date.now()}.png`

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })

    if (error) {
      alert(error.message)
      setUploading(false)
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path)

    setPreview(publicUrl)
    onUploaded(publicUrl)
    setUploading(false)
  }

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-3xl bg-gray-100 border-2 border-white shadow-xl overflow-hidden flex items-center justify-center relative">
        {preview ? (
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
          </div>
        )}
      </div>
      <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 transition-all">
        <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
      </label>
    </div>
  )
}
