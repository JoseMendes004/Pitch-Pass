import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import type { Court } from '@pitch-pass/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'
const toAbsUrl = (url: string) => url.startsWith('/') ? `${API_URL}${url}` : url

const surfaceLabel: Record<string, string> = {
  GRASS: 'Pasto natural',
  ARTIFICIAL_GRASS: 'Pasto sintético',
  CONCRETE: 'Cemento',
  FUTSAL: 'Futsal',
}

const surfaceIcon: Record<string, string> = {
  GRASS: 'grass',
  ARTIFICIAL_GRASS: 'sports_soccer',
  CONCRETE: 'crop_square',
  FUTSAL: 'sports_soccer',
}

export default function CourtCard({ court }: { court: Court }) {
  return (
    <Link
      href={`/courts/${court.id}`}
      className="card group block hover:border-brand-primary/30 transition-all duration-200 overflow-hidden p-0"
    >
      {/* Image */}
      <div className="aspect-video bg-surface-elevated overflow-hidden relative">
        {court.imageUrls[0] ? (
          <img
            src={toAbsUrl(court.imageUrls[0])}
            alt={court.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <span
              className="material-symbols-outlined text-text-muted"
              style={{ fontSize: '40px', fontVariationSettings: "'FILL' 0" }}
            >
              stadium
            </span>
            <span className="text-text-muted text-xs">Sin imagen</span>
          </div>
        )}
        {/* Price badge */}
        <div className="absolute top-2.5 right-2.5 bg-surface-overlay/80 backdrop-blur-sm border border-surface-border px-2.5 py-1 rounded-lg">
          <span className="font-montserrat font-bold text-brand-primary text-sm">
            {formatCurrency(court.pricePerHour)}
          </span>
          <span className="text-text-muted text-[10px]">/h</span>
        </div>
        {/* Availability dot */}
        <div className="absolute top-2.5 left-2.5 bg-surface-overlay/80 backdrop-blur-sm border border-surface-border px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse-green shrink-0" />
          <span className="text-brand-primary font-semibold text-[11px]">Disponible</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="overflow-hidden">
            <h3 className="font-semibold text-text-primary group-hover:text-brand-primary transition-colors truncate">
              {court.name}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="material-symbols-outlined text-text-muted text-[13px]">location_on</span>
              <p className="text-text-secondary text-xs truncate">{court.city}</p>
            </div>
          </div>
          <span
            className="material-symbols-outlined text-text-muted shrink-0 group-hover:text-brand-primary transition-colors"
            style={{ fontSize: '18px' }}
          >
            chevron_right
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-2 mt-3 flex-wrap">
          <span className="badge badge-gray text-[10px]">
            <span
              className="material-symbols-outlined text-[12px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {surfaceIcon[court.surface] ?? 'sports_soccer'}
            </span>
            {surfaceLabel[court.surface] ?? court.surface}
          </span>
          <span className="badge badge-gray text-[10px]">
            <span className="material-symbols-outlined text-[12px]">groups</span>
            {court.maxPlayers}v{court.maxPlayers / 2}
          </span>
          {court.amenities?.slice(0, 1).map((a) => (
            <span key={a} className="badge badge-gray text-[10px]">{a}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}
