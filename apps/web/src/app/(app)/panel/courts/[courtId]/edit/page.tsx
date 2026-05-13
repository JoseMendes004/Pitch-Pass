'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'
import type { Court, CourtSurface } from '@pitch-pass/types'
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

export default function EditCourtPage() {
  const router = useRouter()
  const { courtId } = useParams<{ courtId: string }>()
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    surface: 'ARTIFICIAL_GRASS' as CourtSurface,
    pricePerHour: '',
    maxPlayers: '10',
    description: '',
    isActive: true,
  })

  useEffect(() => {
    apiClient
      .get<{ data: Court }>(`/courts/${courtId}`)
      .then(({ data }) => {
        const c = data.data
        setForm({
          name: c.name,
          address: c.address,
          city: c.city,
          surface: c.surface,
          pricePerHour: String(c.pricePerHour),
          maxPlayers: String(c.maxPlayers),
          description: c.description ?? '',
          isActive: c.isActive,
        })
        setImages(c.imageUrls ?? [])
      })
      .catch(() => toast.error('Error al cargar la cancha'))
      .finally(() => setFetching(false))
  }, [courtId])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await apiClient.delete(`/courts/${courtId}`)
      toast.success('Cancha eliminada')
      router.push('/panel/courts')
    } catch {
      toast.error('Error al eliminar la cancha')
      setDeleting(false)
      setConfirmDelete(false)
    }
  }

  const set = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await apiClient.patch(`/courts/${courtId}`, {
        ...form,
        pricePerHour: parseFloat(form.pricePerHour),
        maxPlayers: parseInt(form.maxPlayers),
        imageUrls: images,
      })
      toast.success('Cancha actualizada')
      router.push('/panel/courts')
    } catch {
      toast.error('Error al guardar los cambios')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-xl space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse h-24" />
        ))}
      </div>
    )
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
          <h1 className="page-title">Editar cancha</h1>
          <p className="page-subtitle">Modificá los datos de tu cancha</p>
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

        {/* Status */}
        <div className="card-elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">Cancha activa</p>
              <p className="text-xs text-text-muted mt-0.5">
                Desactivá para ocultar la cancha de búsquedas sin eliminarla
              </p>
            </div>
            <button
              type="button"
              onClick={() => set('isActive', !form.isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                form.isActive ? 'bg-brand-primary' : 'bg-surface-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                  form.isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
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
                Guardar cambios
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

        {/* Delete zone */}
        <div className="border border-danger/20 rounded-xl p-4 space-y-3">
          <div>
            <p className="text-sm font-semibold text-danger">Zona de peligro</p>
            <p className="text-xs text-text-muted mt-0.5">
              Eliminar la cancha es permanente y no se puede deshacer.
            </p>
          </div>
          {!confirmDelete ? (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-danger/30 text-danger text-sm font-medium hover:bg-danger/10 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">delete</span>
              Eliminar cancha
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <p className="text-sm text-danger font-medium">¿Confirmar eliminación?</p>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-danger text-white text-sm font-semibold hover:bg-danger/80 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
                ) : (
                  <span className="material-symbols-outlined text-[14px]">delete_forever</span>
                )}
                Sí, eliminar
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
