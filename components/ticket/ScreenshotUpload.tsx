'use client'

import { useRef, useState } from 'react'
import { compressImage, SCREENSHOT_OPTIONS } from '@/lib/utils/imageCompressor'

interface Props {
  userId: string
  onUploaded: (dataUrl: string) => void
}

export function ScreenshotUpload({ onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [compressing, setCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sizeInfo, setSizeInfo] = useState<string | null>(null)

  const handleFile = async (file: File) => {
    setError(null)
    setSizeInfo(null)
    setCompressing(true)
    setPreview(null)

    const result = await compressImage(file, SCREENSHOT_OPTIONS)
    setCompressing(false)

    if ('error' in result) {
      setError(result.error)
      return
    }

    setPreview(result.dataUrl)
    setSizeInfo(`${result.sizeKb} Ko`)
    onUploaded(result.dataUrl)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    setSizeInfo(null)
    setError(null)
    onUploaded('')
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">
        Capture d&apos;écran du bug
        <span className="ml-1 text-xs text-gray-400 font-normal">(optionnel, max 100 Ko)</span>
      </label>

      {preview ? (
        <div className="relative group rounded-xl overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Aperçu de la capture" className="w-full max-h-48 object-contain bg-gray-50" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-500 text-xs font-bold px-4 py-2 rounded-xl shadow-lg"
            >
              Supprimer
            </button>
          </div>
          {sizeInfo && (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              {sizeInfo}
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-8 text-center cursor-pointer hover:border-primary hover:bg-blue-50/30 transition-all"
        >
          {compressing ? (
            <>
              <svg className="animate-spin h-8 w-8 text-primary mb-2" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              <p className="text-sm font-medium text-gray-500">Compression en cours…</p>
            </>
          ) : (
            <>
              <svg className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-gray-500">
                Cliquez ou glissez une image ici
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WebP — compressée automatiquement</p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs font-bold text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
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
