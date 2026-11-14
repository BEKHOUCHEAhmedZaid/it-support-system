export type Role = 'client' | 'technician' | 'admin'

export type ProfileStatus = 'pending' | 'approved' | 'rejected' | 'disabled'

export type Profile = {
  id: string
  role: Role
  full_name: string | null
  avatar_url: string | null
  status?: ProfileStatus
  email?: string
}

export type TicketStatus = 'open' | 'new' | 'in_progress' | 'resolved'
export type TicketPriority = 'bloquant' | 'haute' | 'normale'
export type TicketCategory = 'Réseau' | 'Logiciel' | 'Matériel' | 'Autre'

export type Ticket = {
  id: string
  employee_id: string
  technician_id: string | null
  title: string
  description: string
  category: TicketCategory
  priority: TicketPriority
  status: TicketStatus
  system_info: Record<string, unknown> | string
  screenshot_url: string | null
  created_at: string
  resolved_at: string | null
  resolution: string | null
  employee?: Profile
  technician?: Profile | null
  has_messages?: boolean
  last_message_at?: string | null
}

export type Message = {
  id: string
  ticket_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: Profile
}

export type FaqArticle = {
  id: string
  title: string
  content: string
  category: string | null
  created_by: string | null
  is_public: boolean
  created_at: string
  author?: Profile
}

export type Feedback = {
  id: string
  ticket_id: string
  rating: number
  comment: string | null
  created_at: string
}

export type SystemInfo = {
  userAgent: string
  platform: string
  language: string
  screenWidth: number
  screenHeight: number
  windowWidth: number
  windowHeight: number
  hardwareConcurrency: number
  deviceMemory?: number
  connectionType?: string
  recentErrors: string[]
}
