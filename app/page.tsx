'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Screen, Staff, StaffPublic, MeetingResult } from '@/lib/types'
import HomeScreen      from '@/components/HomeScreen'
import PinScreen       from '@/components/PinScreen'
import OwnerStaffScreen from '@/components/OwnerStaffScreen'
import OwnerLogScreen  from '@/components/OwnerLogScreen'
import OrganiserScreen from '@/components/OrganiserScreen'
import MeterScreen     from '@/components/MeterScreen'
import ResultScreen    from '@/components/ResultScreen'

export default function Page() {
  const [screen, setScreen] = useState<Screen>('home')
  const [pin, setPin] = useState('')
  const [ownerStaff, setOwnerStaff] = useState<Staff[]>([])
  const [publicStaff, setPublicStaff] = useState<StaffPublic[]>([])
  const [meetingSelected, setMeetingSelected] = useState<StaffPublic[]>([])
  const [ratePerSec, setRatePerSec] = useState(0)
  const [result, setResult] = useState<MeetingResult | null>(null)

  const fetchPublicStaff = useCallback(async () => {
    const res = await fetch('/api/staff')
    const data = await res.json()
    setPublicStaff(Array.isArray(data) ? data : [])
  }, [])

  const fetchOwnerStaff = useCallback(async (ownerPin: string) => {
    const res = await fetch('/api/staff/rates', { headers: { 'x-owner-pin': ownerPin } })
    const data = await res.json()
    setOwnerStaff(Array.isArray(data) ? data : [])
  }, [])

  useEffect(() => { fetchPublicStaff() }, [fetchPublicStaff])

  async function handlePinSuccess(verifiedPin: string) {
    setPin(verifiedPin)
    await fetchOwnerStaff(verifiedPin)
    setScreen('owner-staff')
  }

  async function handleGo(selectedIds: Set<string>) {
    // Get the public staff objects for selected IDs
    const sel = publicStaff.filter(p => selectedIds.has(p.id))

    // Fetch combined rate-per-second from server (no individual rates returned)
    const rateRes = await fetch('/api/staff/selected-rates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    })
    const { rate } = await rateRes.json() as { rate: number }

    setMeetingSelected(sel)
    setRatePerSec(rate)
    setScreen('meter')
  }

  async function handleStop(cost: number, duration_ms: number) {
    const attendees = meetingSelected.map(p => p.name)
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendees, duration_ms, cost }),
    })
    setResult({ cost, duration_ms, attendees })
    setScreen('result')
  }

  return (
    <>
      {screen === 'home' && (
        <HomeScreen onOwner={() => setScreen('pin')} onOrganiser={() => setScreen('organiser')} />
      )}
      {screen === 'pin' && (
        <PinScreen onSuccess={handlePinSuccess} onBack={() => setScreen('home')} />
      )}
      {screen === 'owner-staff' && (
        <OwnerStaffScreen
          pin={pin}
          staff={ownerStaff}
          onRefresh={() => fetchOwnerStaff(pin)}
          onViewLog={() => setScreen('owner-log')}
          onHome={() => setScreen('home')}
        />
      )}
      {screen === 'owner-log' && (
        <OwnerLogScreen pin={pin} onBack={() => setScreen('owner-staff')} />
      )}
      {screen === 'organiser' && (
        <OrganiserScreen staff={publicStaff} onGo={handleGo} onBack={() => setScreen('home')} />
      )}
      {screen === 'meter' && (
        <MeterScreen selected={meetingSelected} ratePerSec={ratePerSec} onStop={handleStop} />
      )}
      {screen === 'result' && result && (
        <ResultScreen
          cost={result.cost}
          duration_ms={result.duration_ms}
          attendees={result.attendees}
          onNewMeeting={() => setScreen('organiser')}
          onHome={() => setScreen('home')}
        />
      )}
    </>
  )
}
