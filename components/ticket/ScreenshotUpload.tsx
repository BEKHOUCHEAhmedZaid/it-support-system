'use client'

import { useState } from 'react'

interface Props {
  userId: string
  onUploaded: (url: string) => void
}

export function ScreenshotUpload({ onUploaded }: Props) {
  const [preview] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Capture d&#39;écran du bug</label>
      <div
        className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-8 text-center cursor-not-allowed"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Aperçu" className="max-h-40 rounded-lg object-contain" />
        ) : (
          <>
            <svg className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
            <p className="text-sm font-medium text-gray-400">
              Téléversement de captures désactivé temporairement
            </p>
            <p className="text-xs text-gray-400 mt-1">
              (Configuration du stockage gratuit à l&#39;Étape 8)
            </p>
          </>
        )}
      </div>
    </div>
  )
}
