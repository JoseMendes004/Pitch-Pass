'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { formatTime, formatDate, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import type { Booking } from '@pitch-pass/types'

const statusConfig: Record<string, { label: string; className: string; icon: string }> = {
  CONFIRMED: {
    label: 'Confirmada',
    className: 'badge-green',
    icon: 'check_circle',
  },
  PENDING: {
    label: 'Pendiente',
    className: 'badge-yellow',
    icon: 'pending',
  },
  CANCELLED: {
    label: 'Cancelada',
    className: 'badge-red',
    icon: 'cancel',
  },
  COMPLETED: {
    label: 'Completada',
    className: 'badge-gray',
    icon: 'task_alt',
  },
  NO_SHOW: {
    label: 'No asistió',
    className: 'badge-gray',
    icon: 'person_off',
  },
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  useEffect(() => {
    apiClient
      .get('/bookings/mine')
      .then(({ data }) => setBookings(data.data))
      .catch(() => toast.error('Error al cargar las reservas'))
      .finally(() => setLoading(false))
  }, [])

  const cancel = async (id: string) => {
    setCancelling(id)
    try {
      await apiClient.patch(`/bookings/${id}/cancel`, { reason: 'Cancelled by user' })
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' } : b)),
      )
      toast.success('Reserva cancelada')
    } catch {
      toast.error('Error al cancelar')
    } finally {
      setCancelling(null)
    }
  }

  const upcoming = bookings.filter((b) =>
    ['CONFIRMED', 'PENDING'].includes(b.status),
  )
  const past = bookings.filter((b) =>
    ['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status),
  )

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="page-title">Mis reservas</h1>
        <p className="page-subtitle">Historial de todas tus reservas</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-surface-elevated rounded w-48" />
                  <div className="h-3 bg-surface-elevated rounded w-32" />
                </div>
                <div className="h-6 bg-surface-elevated rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-16">
          <span
            className="material-symbols-outlined text-text-muted mb-3"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0" }}
          >
            event_busy
          </span>
          <p className="text-text-secondary font-medium">No tenés reservas aún</p>
          <p className="text-text-muted text-sm mt-1">
            Encontrá una cancha y reservá en segundos
          </p>
          <Link href="/courts" className="btn-primary text-sm mt-5 inline-flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">sports_soccer</span>
            Buscar canchas
          </Link>
        </div>
      ) : (
        <>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1">
                Próximas
              </h2>
              {upcoming.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onCancel={cancel}
                  cancelling={cancelling}
                />
              ))}
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest px-1 pt-2">
                Historial
              </h2>
              {past.map((booking) => (
                <BookingRow
                  key={booking.id}
                  booking={booking}
                  onCancel={cancel}
                  cancelling={cancelling}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function BookingRow({
  booking,
  onCancel,
  cancelling,
}: {
  booking: Booking
  onCancel: (id: string) => void
  cancelling: string | null
}) {
  const cfg = statusConfig[booking.status] ?? statusConfig.PENDING

  return (
    <div className="card hover:border-surface-border/80 transition-all">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-text-muted"
              style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
            >
              {cfg.icon}
            </span>
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-text-primary text-sm truncate">
              {booking.timeSlot
                ? `${formatDate(booking.timeSlot.startsAt)}`
                : 'Fecha no disponible'}
            </div>
            <div className="text-text-muted text-xs mt-0.5 tabular-nums">
              {booking.timeSlot
                ? `${formatTime(booking.timeSlot.startsAt)} – ${formatTime(booking.timeSlot.endsAt)}`
                : '—'}
              {' · '}
              <span className="text-brand-primary font-medium">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className={`badge ${cfg.className}`}>
            {cfg.label}
          </span>
          {booking.status === 'CONFIRMED' && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={cancelling === booking.id}
              className="text-xs text-text-muted hover:text-danger transition-colors disabled:opacity-50"
            >
              {cancelling === booking.id ? 'Cancelando...' : 'Cancelar'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
