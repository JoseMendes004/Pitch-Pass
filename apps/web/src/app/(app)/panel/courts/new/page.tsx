'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { CourtSurface } from '@pitch-pass/types'
import ImageUploader from '@/components/courts/image-uploader'

const surfaces: { value: CourtSurface; label: string; icon: string }[] = [
  { value: 'ARTIFICIAL_GRASS', label: 'Pasto sintético', icon: 'grass' },
  { value: 'GRASS', label: 'Pasto natural', icon: 'nature' },
  { value: 'FUTSAL', label: 'Futsal', icon: 'sports_soccer' },
  { value: 'CONCRETE', label: 'Cemento', icon: 'crop_square' },
]

const playerOptions = [
  { value: '6', label: '6 — 3v3' },
  { value: '8', label: '8 — 4v4' },
  { value: '10', label: '10 — 5v5' },
  { value: '12', label: '12 — 6v6' },
  { value: '14', label: '14 — 7v7' },
  { value: '22', label: '22 — 11v11' },
]

export default function NewCourtPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    surface: 'ARTIFICIAL_GRASS' as CourtSurface,
    pricePerHour: '',
    maxPlayers: '10',
    description: '',
  })

  const set = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.post('/courts', {
        ...form,
        pricePerHour: parseFloat(form.pricePerHour),
        maxPlayers: parseInt(form.maxPlayers),
        imageUrls: images,
      })
      toast.success('Cancha creada exitosamente')
      router.push('/panel/courts')
    } catch {
      toast.error('Error al crear la cancha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/panel/courts"
          className="w-8 h-8 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center hover:border-brand-primary/30 transition-colors"
        >
          <span className="material-symbols-outlined text-text-muted text-[16px]">arrow_back</span>
        </Link>
        <div>
          <h1 className="page-title">Nueva cancha</h1>
          <p className="page-subtitle">Completá los datos para agregar tu cancha</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <div className="card-elevated space-y-4">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Información básica
          </h2>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Nombre de la cancha *
            </label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              className="input-field"
              placeholder="Cancha El Pibe"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Dirección *
              </label>
              <input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                className="input-field"
                placeholder="Av. Siempreviva 742"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Ciudad *
              </label>
              <input
                value={form.city}
                onChange={(e) => set('city', e.target.value)}
                className="input-field"
                placeholder="Buenos Aires"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
              Descripción
            </label>
            <textarea
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              className="input-field resize-none"
              placeholder="Estacionamiento disponible, vestuarios, iluminación..."
            />
          </div>
        </div>

        {/* Surface */}
        <div className="card-elevated space-y-4">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Tipo de superficie
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {surfaces.map(({ value, label, icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => set('surface', value)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl border text-sm transition-all duration-150 ${
                  form.surface === value
                    ? 'border-brand-primary bg-brand-primary/10 text-brand-primary shadow-brand-glow-sm'
                    : 'border-surface-border bg-surface-elevated text-text-secondary hover:border-brand-primary/30 hover:text-text-primary'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: form.surface === value ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {icon}
                </span>
                <span className="font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & capacity */}
        <div className="card-elevated space-y-4">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Precio y capacidad
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Precio por hora ($) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricePerHour}
                  onChange={(e) => set('pricePerHour', e.target.value)}
                  className="input-field pl-7"
                  placeholder="5000"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">
                Capacidad
              </label>
              <select
                value={form.maxPlayers}
                onChange={(e) => set('maxPlayers', e.target.value)}
                className="input-field"
              >
                {playerOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="card-elevated space-y-4">
          <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest">
            Imágenes
          </h2>
          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex-1 h-11 font-semibold flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  progress_activity
                </span>
                Guardando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">check</span>
                Crear cancha
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-ghost h-11 px-6"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
