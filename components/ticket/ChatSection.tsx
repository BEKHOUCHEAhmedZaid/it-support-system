'use client'
import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Message, Profile } from '@/lib/types'
import { sendMessage } from '@/lib/actions/tickets'

interface Props {
  ticketId: string
  currentUserId: string
  initialMessages: (Message & { sender: Profile | null })[]
}

export function ChatSection({ ticketId, currentUserId, initialMessages }: Props) {
  const [messages, setMessages] = useState(initialMessages)
  const [content, setContent]  = useState('')
  const [sending, setSending]  = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Supabase Realtime subscription
  useEffect(() => {
    const supabase = createClient()
    const channel  = supabase
      .channel(`ticket-messages-${ticketId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `ticket_id=eq.${ticketId}` },
        async (payload) => {
          // Fetch the sender profile for the new message
          const { data: sender } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', payload.new.sender_id)
            .single()
          setMessages(prev => [...prev, { ...(payload.new as Message), sender: sender ?? null }])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [ticketId])

  const handleSend = async () => {
    if (!content.trim()) return
    setSending(true)
    await sendMessage(ticketId, content.trim())
    setContent('')
    setSending(false)
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
        
        {messages.map((msg, idx) => {
          const isMe = msg.sender_id === currentUserId
          const isTechnician = msg.sender?.role === 'technician'
          
          return (
            <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed relative
                  ${isMe 
                    ? 'bg-blue-50 text-gray-800 rounded-tr-sm' 
                    : isTechnician 
                      ? 'bg-sidebar text-white rounded-tl-sm' 
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}
              >
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

      {/* Typing indicator (simulated for effect) */}
      <div className="flex items-center gap-2 ml-1">
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-full px-3 py-1.5">
          <span className="text-[10px] text-gray-400 font-medium italic">L&apos;agent est en train d&apos;écrire...</span>
        </div>
      </div>

      {/* Input */}
      <div className="relative group">
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl p-2 pl-4 focus-within:border-primary focus-within:ring-4 focus-within:ring-blue-50 transition-all">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
          </button>
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
