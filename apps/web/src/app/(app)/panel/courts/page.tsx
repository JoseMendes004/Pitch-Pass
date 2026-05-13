'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import apiClient from '@/lib/api-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const toAbsUrl = (url: string) => url.startsWith('/') ? `${API_URL}${url}` : url
import { formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { useAuth } from '@/providers/auth-provider'
import type { Court } from '@pitch-pass/types'

const surfaceLabel: Record<string, string> = {
  GRASS: 'Pasto natural',
  ARTIFICIAL_GRASS: 'Pasto sintético',
  CONCRETE: 'Cemento',
  FUTSAL: 'Futsal',
}

export default function PanelCourtsPage() {
  const { firebaseUser, loading: authLoading } = useAuth()
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !firebaseUser) return
    setLoading(true)
    apiClient
      .get('/courts/owner/mine')
      .then(({ data }) => setCourts(data.data))
      .catch(() => toast.error('Error al cargar las canchas'))
      .finally(() => setLoading(false))
  }, [firebaseUser, authLoading])

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title">Mis canchas</h1>
        <p className="page-subtitle">
          {loading
            ? 'Cargando...'
            : `${courts.length} cancha${courts.length !== 1 ? 's' : ''} registrada${courts.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="card animate-pulse flex gap-4">
              <div className="w-20 h-14 bg-surface-elevated rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-elevated rounded w-1/2" />
                <div className="h-3 bg-surface-elevated rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : courts.length === 0 ? (
        <div className="card text-center py-16">
          <span
            className="material-symbols-outlined text-text-muted mb-3"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0" }}
          >
            stadium
          </span>
          <p className="text-text-secondary font-medium">No tenés canchas registradas aún</p>
          <p className="text-text-muted text-sm mt-1">
            Agregá tu primera cancha para empezar a recibir reservas
          </p>
          <Link
            href="/panel/courts/new"
            className="btn-primary text-sm mt-5 inline-flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Agregar primera cancha
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courts.map((court) => (
            <div
              key={court.id}
              className="card hover:border-surface-border/80 transition-all flex items-center gap-4"
            >
              {/* Thumbnail */}
              <div className="w-20 h-14 bg-surface-elevated border border-surface-border rounded-lg overflow-hidden shrink-0">
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
                      style={{ fontSize: '20px', fontVariationSettings: "'FILL' 0" }}
                    >
                      stadium
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">{court.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-text-muted text-xs">{court.city}</span>
                  <span className="badge badge-gray text-[10px]">
                    {surfaceLabel[court.surface] ?? court.surface}
                  </span>
                  <span className={`badge text-[10px] ${court.isActive ? 'badge-green' : 'badge-gray'}`}>
                    {court.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
              </div>

              {/* Price + actions */}
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="font-bold text-brand-primary tabular-nums">
                    {formatCurrency(court.pricePerHour)}
                  </div>
                  <div className="text-text-muted text-[10px]">/hora</div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/panel/slots?courtId=${court.id}`}
                    className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                    Slots
                  </Link>
                  <Link
                    href={`/panel/courts/${court.id}/edit`}
                    className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    Editar
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
