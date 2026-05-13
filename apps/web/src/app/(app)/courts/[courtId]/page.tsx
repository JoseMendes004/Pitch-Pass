'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import apiClient from '@/lib/api-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const toAbsUrl = (url: string) => url.startsWith('/') ? `${API_URL}${url}` : url
import CourtCalendar from '@/components/booking/court-calendar'
import { formatCurrency } from '@/lib/utils'
import type { Court, TimeSlot } from '@pitch-pass/types'

const surfaceLabel: Record<string, string> = {
  GRASS: 'Pasto natural',
  ARTIFICIAL_GRASS: 'Pasto sintético',
  CONCRETE: 'Cemento',
  FUTSAL: 'Futsal',
}

function DatePicker({ value, onChange }: { value: string; onChange: (d: string) => void }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return d.toISOString().split('T')[0]
  })

  const fmt = (iso: string) => {
    const d = new Date(iso + 'T00:00:00')
    return {
      day: d.toLocaleDateString('es-AR', { weekday: 'short' }),
      num: d.getDate(),
    }
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {days.map((d) => {
        const { day, num } = fmt(d)
        const active = d === value
        return (
          <button
            key={d}
            onClick={() => onChange(d)}
            className={`flex flex-col items-center px-3 py-2.5 rounded-xl shrink-0 transition-all duration-150 min-w-[52px] ${
              active
                ? 'bg-brand-primary text-surface-bg font-bold shadow-brand-glow-sm'
                : 'bg-surface-elevated border border-surface-border text-text-secondary hover:border-brand-primary/30 hover:text-text-primary'
            }`}
          >
            <span className="text-[10px] font-medium capitalize">{day}</span>
            <span className="text-lg font-bold tabular-nums leading-tight">{num}</span>
          </button>
        )
      })}
    </div>
  )
}

export default function CourtDetailPage() {
  const { courtId } = useParams<{ courtId: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [date, setDate] = useState(
    searchParams.get('date') ?? new Date().toISOString().split('T')[0],
  )
  const [court, setCourt] = useState<Court | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [slotsLoading, setSlotsLoading] = useState(false)

  useEffect(() => {
    Promise.all([
      apiClient.get(`/courts/${courtId}`),
      apiClient.get(`/courts/${courtId}/slots?date=${date}`),
    ])
      .then(([courtRes, slotsRes]) => {
        setCourt(courtRes.data.data)
        setSlots(slotsRes.data.data)
      })
      .finally(() => setLoading(false))
  }, [courtId])

  const handleDateChange = (newDate: string) => {
    setDate(newDate)
    setSlotsLoading(true)
    apiClient
      .get(`/courts/${courtId}/slots?date=${newDate}`)
      .then(({ data }) => setSlots(data.data))
      .finally(() => setSlotsLoading(false))
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl animate-pulse">
        <div className="h-8 bg-surface-elevated rounded w-1/3" />
        <div className="h-64 bg-surface-elevated rounded-xl" />
      </div>
    )
  }
  if (!court) {
    return (
      <div className="card text-center py-16 max-w-md">
        <p className="text-text-secondary">Cancha no encontrada.</p>
        <button onClick={() => router.push('/courts')} className="btn-secondary mt-4 text-sm">
          Volver a canchas
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <button
        onClick={() => router.push('/courts')}
        className="flex items-center gap-1.5 text-text-muted hover:text-text-primary transition-colors text-sm"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Volver a canchas
      </button>

      {/* Court header */}
      <div className="card-elevated p-0 overflow-hidden">
        {/* Image banner */}
        <div className="h-52 bg-surface-elevated relative overflow-hidden">
          {court.imageUrls[0] ? (
            <img
              src={toAbsUrl(court.imageUrls[0])}
              alt={court.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span
                className="material-symbols-outlined text-text-muted"
                style={{ fontSize: '64px', fontVariationSettings: "'FILL' 0" }}
              >
                stadium
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent" />
          {/* Price overlay */}
          <div className="absolute bottom-4 right-4 bg-surface-overlay/80 backdrop-blur-sm border border-surface-border rounded-xl px-4 py-2 text-right">
            <div className="font-montserrat font-bold text-brand-primary text-xl tabular-nums">
              {formatCurrency(court.pricePerHour)}
            </div>
            <div className="text-text-muted text-xs">/hora</div>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h1 className="font-montserrat text-2xl font-bold text-text-primary">{court.name}</h1>
          <div className="flex items-center gap-1.5 mt-1.5 text-text-secondary text-sm">
            <span className="material-symbols-outlined text-[15px]">location_on</span>
            {court.address}, {court.city}
          </div>

          {/* Tags */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="badge badge-gray">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                sports_soccer
              </span>
              {surfaceLabel[court.surface] ?? court.surface}
            </span>
            <span className="badge badge-gray">
              <span className="material-symbols-outlined text-[13px]">groups</span>
              {court.maxPlayers} jugadores
            </span>
            {court.amenities?.map((a) => (
              <span key={a} className="badge badge-gray">{a}</span>
            ))}
          </div>

          {court.description && (
            <p className="text-text-secondary text-sm mt-3 leading-relaxed">{court.description}</p>
          )}
        </div>
      </div>

      {/* Calendar section */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-montserrat font-bold text-text-primary">Elegí un horario</h2>
          <div className="flex items-center gap-1.5">
            <span className="live-dot" />
            <span className="text-text-muted text-xs">Tiempo real</span>
          </div>
        </div>

        <DatePicker value={date} onChange={handleDateChange} />

        {slotsLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 bg-surface-elevated rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <CourtCalendar
            courtId={court.id}
            date={date}
            initialSlots={slots}
            pricePerHour={court.pricePerHour}
          />
        )}
      </div>
    </div>
  )
}
