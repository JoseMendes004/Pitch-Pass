'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import { formatTime } from '@/lib/utils'
import type { Court, TimeSlot } from '@pitch-pass/types'

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7) // 7–22

function HourLabel(h: number) {
  return `${String(h).padStart(2, '0')}:00`
}

export default function SlotsPage() {
  const searchParams = useSearchParams()
  const preselectedCourt = searchParams.get('courtId') ?? ''

  const [courts, setCourts] = useState<Court[]>([])
  const [selectedCourt, setSelectedCourt] = useState(preselectedCourt)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [startHour, setStartHour] = useState(7)
  const [endHour, setEndHour] = useState(23)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    apiClient
      .get('/courts/owner/mine')
      .then(({ data }) => {
        setCourts(data.data)
        if (!preselectedCourt && data.data.length > 0) {
          setSelectedCourt(data.data[0].id)
        }
      })
      .catch(() => toast.error('Error al cargar canchas'))
  }, [])

  const loadSlots = () => {
    if (!selectedCourt) return
    setLoading(true)
    apiClient
      .get(`/courts/${selectedCourt}/slots?date=${date}`)
      .then(({ data }) => setSlots(data.data))
      .catch(() => toast.error('Error al cargar slots'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (selectedCourt) loadSlots()
  }, [selectedCourt, date])

  const generate = async () => {
    if (!selectedCourt) return
    setGenerating(true)
    try {
      await apiClient.post(`/courts/${selectedCourt}/slots/generate`, {
        date,
        startHour,
        endHour,
      })
      toast.success('Slots generados correctamente')
      loadSlots()
    } catch {
      toast.error('Error al generar slots')
    } finally {
      setGenerating(false)
    }
  }

  const toggleSlot = async (slot: TimeSlot) => {
    const newStatus = slot.status === 'AVAILABLE' ? 'BLOCKED' : 'AVAILABLE'
    try {
      await apiClient.patch(`/courts/${selectedCourt}/slots/${slot.id}`, { status: newStatus })
      setSlots((prev) =>
        prev.map((s) => (s.id === slot.id ? { ...s, status: newStatus } : s)),
      )
    } catch {
      toast.error('Error al actualizar slot')
    }
  }

  const deleteSlots = async () => {
    if (!selectedCourt) return
    try {
      await apiClient.delete(`/courts/${selectedCourt}/slots?date=${date}`)
      toast.success('Slots eliminados')
      setSlots([])
    } catch {
      toast.error('Error al eliminar slots')
    }
  }

  const court = courts.find((c) => c.id === selectedCourt)

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="page-title">Gestión de horarios</h1>
        <p className="page-subtitle">Generá y administrá los slots de tus canchas</p>
      </div>

      {/* Config panel */}
      <div className="card-elevated space-y-5">
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">
          Configuración
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Court selector */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Cancha
            </label>
            <select
              value={selectedCourt}
              onChange={(e) => setSelectedCourt(e.target.value)}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              {courts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Fecha
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Hour range */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Rango horario
            </label>
            <div className="flex gap-2 items-center">
              <select
                value={startHour}
                onChange={(e) => setStartHour(Number(e.target.value))}
                className="input-field flex-1"
              >
                {HOURS.map((h) => (
                  <option key={h} value={h}>
                    {HourLabel(h)}
                  </option>
                ))}
              </select>
              <span className="text-text-muted text-xs shrink-0">a</span>
              <select
                value={endHour}
                onChange={(e) => setEndHour(Number(e.target.value))}
                className="input-field flex-1"
              >
                {HOURS.filter((h) => h > startHour).map((h) => (
                  <option key={h} value={h}>
                    {HourLabel(h)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={generate}
            disabled={!selectedCourt || generating}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            {generating ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                Generando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                Generar slots
              </>
            )}
          </button>
          {slots.length > 0 && (
            <button
              onClick={deleteSlots}
              className="btn-danger flex items-center gap-2 text-sm"
            >
              <span className="material-symbols-outlined text-[16px]">delete_sweep</span>
              Borrar todos
            </button>
          )}
        </div>
      </div>

      {/* Slots grid */}
      {selectedCourt && (
        <div className="card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-text-primary">
              {court?.name ?? 'Cancha'} — {date}
            </h2>
            {slots.length > 0 && (
              <span className="text-text-muted text-xs">
                {slots.filter((s) => s.status === 'AVAILABLE').length} disponibles
                {' / '}
                {slots.length} total
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-20 bg-surface-elevated rounded-xl animate-pulse" />
              ))}
            </div>
          ) : slots.length === 0 ? (
            <div className="text-center py-12">
              <span
                className="material-symbols-outlined text-text-muted mb-2"
                style={{ fontSize: '40px', fontVariationSettings: "'FILL' 0" }}
              >
                calendar_month
              </span>
              <p className="text-text-secondary text-sm">No hay slots para esta fecha</p>
              <p className="text-text-muted text-xs mt-1">
                Usá el botón "Generar slots" para crear los horarios
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots
                .slice()
                .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime())
                .map((slot) => {
                  const isBooked = slot.status === 'BOOKED'
                  const isAvailable = slot.status === 'AVAILABLE'
                  return (
                    <button
                      key={slot.id}
                      onClick={() => !isBooked && toggleSlot(slot)}
                      disabled={isBooked}
                      title={isBooked ? 'Reservado — no se puede modificar' : isAvailable ? 'Click para bloquear' : 'Click para desbloquear'}
                      className={`rounded-xl px-3 py-4 text-center text-sm transition-all ${
                        isBooked
                          ? 'slot-booked cursor-not-allowed'
                          : isAvailable
                            ? 'slot-available'
                            : 'slot-blocked hover:border-brand-primary/20'
                      }`}
                    >
                      <div className="font-bold tabular-nums text-sm">
                        {formatTime(slot.startsAt)}
                      </div>
                      <div className="text-[10px] mt-0.5 opacity-60 tabular-nums">
                        {formatTime(slot.endsAt)}
                      </div>
                      <div className="text-[10px] mt-1.5 font-medium">
                        {isBooked ? 'Reservado' : isAvailable ? 'Libre' : 'Bloqueado'}
                      </div>
                    </button>
                  )
                })}
            </div>
          )}

          {slots.length > 0 && (
            <p className="text-text-muted text-xs">
              Click en un slot libre para bloquearlo, y viceversa. Los slots reservados no se pueden modificar.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
