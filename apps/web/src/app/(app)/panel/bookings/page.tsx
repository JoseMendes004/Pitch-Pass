'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/lib/api-client'
import { formatCurrency, formatTime } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/providers/auth-provider'

const statusLabel: Record<string, { label: string; class: string }> = {
  CONFIRMED:  { label: 'Confirmada',  class: 'badge-green' },
  CANCELLED:  { label: 'Cancelada',   class: 'badge-gray' },
  PENDING:    { label: 'Pendiente',   class: 'badge-yellow' },
  COMPLETED:  { label: 'Completada',  class: 'badge-gray' },
  NO_SHOW:    { label: 'No asistió',  class: 'badge-red' },
}

export default function PanelBookingsPage() {
  const { firebaseUser, loading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !firebaseUser) return
    apiClient
      .get('/bookings/all')
      .then(({ data }) => setBookings(data.data))
      .catch(() => toast.error('Error al cargar reservas'))
      .finally(() => setLoading(false))
  }, [firebaseUser, authLoading])

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="page-title">Reservas recibidas</h1>
        <p className="page-subtitle">
          {loading ? 'Cargando...' : `${bookings.length} reserva${bookings.length !== 1 ? 's' : ''} en total`}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-20" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-20">
          <span
            className="material-symbols-outlined text-text-muted mb-3"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0" }}
          >
            confirmation_number
          </span>
          <p className="text-text-secondary font-medium">No hay reservas todavía</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const s = statusLabel[b.status] ?? { label: b.status, class: 'badge-gray' }
            const date = new Date(b.timeSlot.startsAt).toLocaleDateString('es-AR', {
              weekday: 'short', day: 'numeric', month: 'short',
            })
            return (
              <div key={b.id} className="card flex items-center gap-4">
                {/* Date block */}
                <div className="w-14 text-center shrink-0">
                  <div className="text-brand-primary font-bold text-sm tabular-nums">
                    {formatTime(b.timeSlot.startsAt)}
                  </div>
                  <div className="text-text-muted text-[10px] mt-0.5">{date}</div>
                </div>

                <div className="w-px h-10 bg-surface-border shrink-0" />

                {/* Court + user */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary truncate">
                    {b.timeSlot.court.name}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-text-muted text-[13px]">person</span>
                    <span className="text-text-muted text-xs truncate">{b.user.displayName}</span>
                    <span className="text-text-muted text-xs opacity-50">·</span>
                    <span className="text-text-muted text-xs truncate">{b.user.email}</span>
                  </div>
                </div>

                {/* Amount + status */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-brand-primary tabular-nums text-sm">
                      {formatCurrency(b.totalAmount)}
                    </div>
                  </div>
                  <span className={`badge text-[10px] ${s.class}`}>{s.label}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
