'use client'

import { useEffect, useState } from 'react'
import apiClient from '@/lib/api-client'
import CourtCard from '@/components/courts/court-card'
import type { Court } from '@pitch-pass/types'

const surfaces = [
  { value: '', label: 'Todas' },
  { value: 'ARTIFICIAL_GRASS', label: 'Sintético' },
  { value: 'GRASS', label: 'Natural' },
  { value: 'FUTSAL', label: 'Futsal' },
  { value: 'CONCRETE', label: 'Cemento' },
]

export default function CourtsPage() {
  const [courts, setCourts] = useState<Court[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [surface, setSurface] = useState('')

  useEffect(() => {
    apiClient.get('/courts')
      .then(({ data }) => setCourts(data.data))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    const matchSurface = surface === '' || c.surface === surface
    return matchSearch && matchSurface
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Canchas disponibles</h1>
          <p className="page-subtitle">Reservá en menos de 1 minuto</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="live-dot" />
          <span className="text-text-muted text-xs">Actualizado en tiempo real</span>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar cancha o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {surfaces.map((s) => (
            <button
              key={s.value}
              onClick={() => setSurface(s.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-150 ${
                surface === s.value
                  ? 'bg-brand-primary/10 border-brand-primary/40 text-brand-primary'
                  : 'bg-surface-elevated border-surface-border text-text-muted hover:border-brand-primary/20 hover:text-text-primary'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-video bg-surface-elevated rounded-lg mb-4" />
              <div className="h-4 bg-surface-elevated rounded w-3/4 mb-2" />
              <div className="h-3 bg-surface-elevated rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <span
            className="material-symbols-outlined text-text-muted mb-3"
            style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0" }}
          >
            search_off
          </span>
          <p className="text-text-secondary font-medium">No se encontraron canchas</p>
          <p className="text-text-muted text-sm mt-1">
            {search ? `Sin resultados para "${search}"` : 'No hay canchas disponibles'}
          </p>
          {search && (
            <button
              onClick={() => setSearch('')}
              className="btn-ghost text-sm mt-4 px-6"
            >
              Limpiar búsqueda
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-text-muted text-sm">
            {filtered.length} cancha{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
