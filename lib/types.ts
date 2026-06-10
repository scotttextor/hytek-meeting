export type Staff = {
  id: string
  name: string
  rate: number
}

export type StaffPublic = {
  id: string
  name: string
}

export type MeetingLog = {
  id: string
  created_at: string
  attendees: string[]
  duration_ms: number
  cost: number
}

export type Screen =
  | 'home'
  | 'pin'
  | 'owner-staff'
  | 'owner-log'
  | 'organiser'
  | 'meter'
  | 'result'

export type MeetingResult = {
  cost: number
  duration_ms: number
  attendees: string[]
}
