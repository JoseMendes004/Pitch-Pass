'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/lib/api-client'
import { formatTime, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { SLOT_HOLD_SECONDS } from '@pitch-pass/config'
import type { TimeSlot } from '@pitch-pass/types'

interface Props {
  slot: TimeSlot
  courtId: string
  pricePerHour: string
  onConfirmed: (slotId: string) => void
  onClose: () => void
}

export default function BookingModal({ slot, pricePerHour, onConfirmed, onClose }: Props) {
  const [timeLeft, setTimeLeft] = useState(SLOT_HOLD_SECONDS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose()
      toast.error('El tiempo de reserva expiró')
      return
    }
    const t = setTimeout(() => setTimeLeft((p) => p - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, onClose])

  const confirm = async () => {
    setLoading(true)
    try {
      await apiClient.post('/bookings', { timeSlotId: slot.id })
      toast.success('¡Reserva confirmada!')
      onConfirmed(slot.id)
    } catch {
      toast.error('Error al confirmar la reserva')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const price = slot.priceOverride ?? pricePerHour
  const progress = (timeLeft / SLOT_HOLD_SECONDS) * 100
  const isUrgent = timeLeft <= 20

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass rounded-2xl w-full max-w-sm shadow-glass-lg animate-slide-up overflow-hidden">

        {/* Timer bar */}
        <div className="h-1 bg-surface-border">
          <div
            className="h-full transition-all duration-1000 ease-linear rounded-r"
            style={{
              width: `${progress}%`,
              background: isUrgent ? '#ef4444' : '#c3f400',
            }}
          />
        </div>

        <div className="p-6 space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-montserrat text-lg font-bold text-text-primary">
                Confirmar reserva
              </h2>
              <p className="text-text-secondary text-xs mt-0.5">
                El slot se liberará si no confirmás
              </p>
            </div>
            <div
              className={`font-mono font-bold text-xl tabular-nums ${
                isUrgent ? 'text-danger' : 'text-brand-primary'
              }`}
            >
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
              {String(timeLeft % 60).padStart(2, '0')}
            </div>
          </div>

          {/* Slot info */}
          <div className="bg-surface-elevated border border-surface-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                Horario
              </div>
              <span className="text-text-primary font-semibold tabular-nums">
                {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
              </span>
            </div>
            <div className="divider" />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <span className="material-symbols-outlined text-[16px]">payments</span>
                Total a pagar
              </div>
              <span className="text-brand-primary font-bold text-lg tabular-nums">
                {formatCurrency(price)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-ghost flex-1 h-10">
              Cancelar
            </button>
            <button
              onClick={confirm}
              disabled={loading}
              className="btn-primary flex-1 h-10 font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">
                    progress_activity
                  </span>
                  Reservando...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Confirmar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
