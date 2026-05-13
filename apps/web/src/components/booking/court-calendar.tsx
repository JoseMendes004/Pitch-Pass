'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSocket } from '@/providers/socket-provider'
import { useAuth } from '@/providers/auth-provider'
import BookingModal from './booking-modal'
import { formatTime, formatCurrency } from '@/lib/utils'
import type { TimeSlot, SlotUpdatedPayload } from '@pitch-pass/types'

interface Props {
  courtId: string
  date: string
  initialSlots: TimeSlot[]
  pricePerHour: string
}

export default function CourtCalendar({ courtId, date, initialSlots, pricePerHour }: Props) {
  const [slots, setSlots] = useState<Record<string, TimeSlot>>(
    Object.fromEntries(initialSlots.map((s) => [s.id, s])),
  )
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const socket = useSocket()
  const { profile } = useAuth()

  useEffect(() => {
    if (!socket) return
    socket.emit('court:join', { courtId, date })

    const handleSlotUpdated = (payload: SlotUpdatedPayload) => {
      setSlots((prev) => {
        const existing = prev[payload.slotId]
        if (!existing) return prev
        return { ...prev, [payload.slotId]: { ...existing, status: payload.status } }
      })
    }

    socket.on('slot:updated', handleSlotUpdated)
    return () => {
      socket.off('slot:updated', handleSlotUpdated)
      socket.emit('court:leave', { courtId })
    }
  }, [socket, courtId, date])

  const handleSlotClick = useCallback(
    (slot: TimeSlot) => {
      if (slot.status !== 'AVAILABLE' || !profile) return
      socket?.emit('slot:hold', { slotId: slot.id, userId: profile.id })
      setSelectedSlot(slot)
    },
    [socket, profile],
  )

  const handleBookingComplete = (slotId: string) => {
    setSlots((prev) => ({
      ...prev,
      [slotId]: { ...prev[slotId], status: 'BOOKED' },
    }))
    setSelectedSlot(null)
  }

  const handleModalClose = () => {
    if (selectedSlot) {
      socket?.emit('slot:release', { slotId: selectedSlot.id })
    }
    setSelectedSlot(null)
  }

  const slotList = Object.values(slots).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )

  const available = slotList.filter((s) => s.status === 'AVAILABLE').length

  return (
    <>
      {/* Legend + count */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-primary/20 border border-brand-primary/40" />
            Disponible
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-danger/10 border border-danger/20" />
            Reservado
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-surface-elevated border border-surface-border" />
            Bloqueado
          </span>
        </div>
        {available > 0 && (
          <span className="badge badge-green text-[10px]">
            {available} libre{available !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {slotList.length === 0 ? (
        <div className="text-center py-16">
          <span
            className="material-symbols-outlined text-text-muted mb-3"
            style={{ fontSize: '40px', fontVariationSettings: "'FILL' 0" }}
          >
            event_busy
          </span>
          <p className="text-text-secondary text-sm">No hay horarios para esta fecha.</p>
          <p className="text-text-muted text-xs mt-1">El dueño aún no generó los slots.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slotList.map((slot) => (
            <button
              key={slot.id}
              onClick={() => handleSlotClick(slot)}
              disabled={slot.status !== 'AVAILABLE'}
              className={`rounded-xl px-3 py-4 text-center text-sm font-medium transition-all ${
                slot.status === 'AVAILABLE'
                  ? 'slot-available'
                  : slot.status === 'BOOKED'
                    ? 'slot-booked'
                    : slot.status === 'BLOCKED'
                      ? 'slot-blocked'
                      : 'slot-maintenance'
              }`}
            >
              <div className="font-bold tabular-nums text-sm">
                {formatTime(slot.startsAt)}
              </div>
              <div className="text-[10px] mt-0.5 opacity-60 tabular-nums">
                {formatTime(slot.endsAt)}
              </div>
              {slot.status === 'AVAILABLE' && (
                <div className="text-[10px] mt-1.5 font-semibold">
                  {formatCurrency(slot.priceOverride ?? pricePerHour)}
                </div>
              )}
              {slot.status === 'BOOKED' && (
                <div className="text-[10px] mt-1.5 opacity-60">Reservado</div>
              )}
              {(slot.status === 'BLOCKED' || slot.status === 'MAINTENANCE') && (
                <div className="text-[10px] mt-1.5 opacity-60">No disponible</div>
              )}
            </button>
          ))}
        </div>
      )}

      {selectedSlot && (
        <BookingModal
          slot={selectedSlot}
          courtId={courtId}
          pricePerHour={pricePerHour}
          onConfirmed={handleBookingComplete}
          onClose={handleModalClose}
        />
      )}
    </>
  )
}
