export default function FavoritesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title">Favoritos</h1>
        <p className="page-subtitle">Tus canchas guardadas</p>
      </div>

      <div className="card text-center py-20">
        <span
          className="material-symbols-outlined text-text-muted mb-3"
          style={{ fontSize: '48px', fontVariationSettings: "'FILL' 1'" }}
        >
          favorite
        </span>
        <p className="text-text-secondary font-medium">Favoritos — Próximamente</p>
        <p className="text-text-muted text-sm mt-1">
          Guardá tus canchas preferidas para reservar más rápido
        </p>
      </div>
    </div>
  )
}
