'use client'

import { useState } from 'react'

interface Props {
  userId: string
  currentAvatar: string | null
  onUploaded: (url: string) => void
}

export function AvatarUpload({ currentAvatar }: Props) {
  const [preview] = useState(currentAvatar)

  return (
    <div className="relative group">
      <div className="w-24 h-24 rounded-3xl bg-gray-100 border-2 border-white shadow-xl overflow-hidden flex items-center justify-center relative">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>
      <div
        title="Téléversement d'avatar temporairement désactivé (Étape 8)"
        className="absolute -bottom-2 -right-2 w-8 h-8 bg-gray-300 text-white rounded-xl shadow-lg border-2 border-white flex items-center justify-center cursor-not-allowed"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
    </div>
  )
}
