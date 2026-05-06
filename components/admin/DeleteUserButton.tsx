'use client'
import { useState } from 'react'
import { deleteUser } from '@/lib/actions/admin'

interface Props {
  userId: string
  userName: string
}

export function DeleteUserButton({ userId, userName }: Props) {
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      setTimeout(() => setConfirm(false), 3000) // Reset after 3s
      return
    }

    setLoading(true)
    const result = await deleteUser(userId)
    if (result?.error) {
      alert(result.error)
      setLoading(false)
      setConfirm(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all
        ${confirm 
          ? 'bg-red-600 text-white animate-pulse' 
          : 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white'
        } disabled:opacity-50`}
    >
      {loading ? '...' : confirm ? 'Confirmer ?' : 'Supprimer'}
    </button>
  )
}
