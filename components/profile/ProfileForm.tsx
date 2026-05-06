'use client'
import { useState } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import { Input } from '@/components/ui/Input'
import { AvatarUpload } from './AvatarUpload'
import type { Profile } from '@/lib/types'

interface Props {
  profile: Profile
}

export function ProfileForm({ profile }: Props) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    formData.set('avatar_url', avatarUrl)

    const result = await updateProfile(formData)
    if (result?.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-xl shadow-gray-100/30 space-y-8">
        <div className="flex flex-col items-center gap-6">
          <AvatarUpload 
            userId={profile.id} 
            currentAvatar={avatarUrl} 
            onUploaded={setAvatarUrl} 
          />
          <div className="text-center">
            <h2 className="text-xl font-black text-gray-900">{profile.full_name}</h2>
            <p className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{profile.role}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-6 border-t border-gray-50">
          <Input 
            id="full_name" 
            name="full_name" 
            label="Nom complet" 
            defaultValue={profile.full_name ?? ''} 
            required 
          />
          
          <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ID Utilisateur</p>
            <p className="text-xs font-mono text-gray-500 break-all">{profile.id}</p>
          </div>

          {message && (
            <div className={`p-4 rounded-2xl text-xs font-bold ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-8 py-4 text-sm font-black text-white shadow-xl shadow-blue-200 hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>

      <div className="bg-amber-50 rounded-3xl border border-amber-100 p-8">
        <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest mb-2">Sécurité</h3>
        <p className="text-xs text-amber-700 font-medium leading-relaxed">
          Pour changer votre mot de passe, un lien de réinitialisation vous sera envoyé par email.
        </p>
        <button className="mt-4 px-6 py-2.5 bg-white border border-amber-200 text-amber-700 text-[10px] font-black rounded-xl hover:bg-amber-100 transition-all uppercase tracking-widest">
          Réinitialiser mon mot de passe
        </button>
      </div>
    </div>
  )
}
