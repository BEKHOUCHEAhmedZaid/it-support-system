export type Role = 'client' | 'technician' | 'admin' | 'employee' // keeping employee for backward compatibility during migration

export type ProfileStatus = 'pending' | 'approved' | 'rejected'

export type Profile = {
  id: string
  role: Role
  full_name: string | null
  avatar_url: string | null
  status?: ProfileStatus // mainly for technicians
}

export type TicketStatus  = 'new' | 'in_progress' | 'resolved'
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
  system_info: Record<string, unknown>
  screenshot_url: string | null
  created_at: string
  resolved_at: string | null
  resolution: string | null
  employee?: Profile
  technician?: Profile | null
}

export type Message = {
  id: number
  ticket_id: string
  sender_id: string
  content: string
  created_at: string
  sender?: Profile
}

export type FaqArticle = {
  id: number
  title: string
  content: string
  category: string | null
  created_by: string | null
  is_public: boolean
  created_at: string
  author?: Profile
}

export type Feedback = {
  id: number
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
