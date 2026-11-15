'use client'

import { useRef, useState } from 'react'
import { compressImage, AVATAR_OPTIONS } from '@/lib/utils/imageCompressor'
import { updateProfile } from '@/lib/actions/profile'

interface Props {
  userId: string
  currentAvatar: string | null
  onUploaded: (dataUrl: string) => void
  /** Initiales à afficher à la place de l'avatar (ex: "JD" pour Jean Dupont) */
  initials?: string
}

export function AvatarUpload({ currentAvatar, onUploaded, initials = '?' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(currentAvatar)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const handleFile = async (file: File) => {
    setError(null)
    setSaved(false)
    setCompressing(true)

    const result = await compressImage(file, AVATAR_OPTIONS)
    setCompressing(false)

    if ('error' in result) {
      setError(result.error)
      return
    }

    setPreview(result.dataUrl)

    // Sauvegarde immédiate dans Firestore via l'action profil
    const fd = new FormData()
    fd.set('avatar_url', result.dataUrl)
    // Préserve le nom existant (l'action ne mettra à jour que avatar_url)
    fd.set('full_name', '')
    const res = await updateProfile(fd)
    if (res?.error) {
      setError(res.error)
      setPreview(currentAvatar)
    } else {
      onUploaded(result.dataUrl)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-3xl bg-gray-100 border-2 border-white shadow-xl overflow-hidden flex items-center justify-center relative">
        {compressing ? (
          <svg className="animate-spin h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          /* Initiales par défaut — jamais d'avatar dans les listes/chat */
          <span className="text-2xl font-black text-gray-400 select-none">
            {initials.substring(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Bouton appareil photo */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={compressing}
        title="Changer l'avatar (96×96, max 10 Ko)"
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center hover:bg-primary-dark transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Indicateur de sauvegarde */}
      {saved && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow">
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="absolute top-full left-0 mt-2 w-56 text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl shadow-lg z-10">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
