'use client'

import { useEffect, useRef, useState } from 'react'
import type { Message, Profile } from '@/lib/types'
import { subscribeToMessages, sendMessage as dbSendMessage } from '@/lib/db/messages'
import { useAuth } from '@/context/AuthContext'

interface Props {
  ticketId: string
  currentUserId: string
  initialMessages: (Message & { sender: Profile | null })[]
}

export function ChatSection({ ticketId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState<(Message & { sender?: Profile | null })[]>(initialMessages)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { profile } = useAuth()

  // Défilement automatique vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Écoute temps réel via Firestore onSnapshot
  useEffect(() => {
    const unsubscribe = subscribeToMessages(ticketId, (updatedMessages) => {
      setMessages(updatedMessages)
    })

    return () => {
      unsubscribe()
    }
  }, [ticketId])

  const handleSend = async () => {
    if (!content.trim() || !profile) return
    setSending(true)
    try {
      await dbSendMessage(ticketId, {
        senderId: currentUserId,
        senderName: profile.full_name || 'Utilisateur',
        senderRole: profile.role,
        // senderAvatar intentionnellement absent : affichage par initiales uniquement
        content: content.trim(),
      })
      setContent('')
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 bg-blue-50 rounded-lg text-primary">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
        </span>
        <h2 className="text-base font-bold text-gray-900">Messages</h2>
      </div>

      {/* Message list */}
      <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto px-1 py-2 scrollbar-hide">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
            </div>
            <p className="text-sm text-gray-400 font-medium">Commencez la discussion...</p>
          </div>
        )}
        
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          const isTechnician = msg.sender?.role === 'technician'
          const senderName = msg.sender?.full_name || 'Utilisateur'
          // Initiales : max 2 caractères (ex: "JD" pour "Jean Dupont")
          const initials = senderName
            .split(' ')
            .map((w) => w[0] ?? '')
            .join('')
            .substring(0, 2)
            .toUpperCase()

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              {/* Initiales à la place de l'avatar */}
              <div className={`flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black select-none
                ${isMe ? 'bg-blue-100 text-primary' : isTechnician ? 'bg-sidebar text-white' : 'bg-gray-200 text-gray-600'}`}>
                {initials}
              </div>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed
                  ${isMe
                    ? 'bg-blue-50 text-gray-800 rounded-tr-sm'
                    : isTechnician
                      ? 'bg-sidebar text-white rounded-tl-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
              >
                {!isMe && (
                  <p className={`text-[10px] font-black mb-1 ${isTechnician ? 'text-blue-200' : 'text-gray-400'}`}>
                    {senderName}
                  </p>
                )}
                {msg.content}
                <div className={`text-[10px] mt-1.5 opacity-40 text-right ${isTechnician && !isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                  {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="relative group">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 pl-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <input
            type="text"
            value={content}
            onChange={e => setContent(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
            placeholder="Écrire un message..."
            className="flex-1 bg-transparent border-none py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:ring-0 focus:outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={!content.trim() || sending}
            className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all
              ${content.trim() 
                ? 'bg-primary text-white shadow-lg shadow-blue-200 hover:bg-primary-dark' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {sending ? (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
            ) : (
              'Envoyer'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
