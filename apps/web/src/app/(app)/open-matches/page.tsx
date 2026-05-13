export default function OpenMatchesPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="page-title">Partidos abiertos</h1>
        <p className="page-subtitle">Unite a un partido o creá el tuyo</p>
      </div>

      <div className="card text-center py-20">
        <span
          className="material-symbols-outlined text-text-muted mb-3"
          style={{ fontSize: '48px', fontVariationSettings: "'FILL' 0" }}
        >
          groups
        </span>
        <p className="text-text-secondary font-medium">Partidos abiertos — Próximamente</p>
        <p className="text-text-muted text-sm mt-1">
          Armá partido con otros jugadores y completá el equipo en minutos
        </p>
      </div>
    </div>
  )
}
