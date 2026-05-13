import { redirect } from 'next/navigation'

const features = [
  {
    icon: 'bolt',
    title: 'Reserva en < 1 min',
    desc: 'Seleccioná cancha, elegí horario, confirmá. Sin llamadas ni esperas.',
  },
  {
    icon: 'sensors',
    title: 'Disponibilidad en tiempo real',
    desc: 'Slots actualizados al instante via WebSocket. Lo que ves es lo que hay.',
  },
  {
    icon: 'qr_code_2',
    title: 'QR de acceso',
    desc: 'Confirmá tu entrada escaneando el código en la puerta. Rápido y seguro.',
  },
  {
    icon: 'groups',
    title: 'Partidos abiertos',
    desc: 'Armá partido con desconocidos. Completá el equipo en minutos.',
  },
  {
    icon: 'star',
    title: 'Reseñas verificadas',
    desc: 'Solo jugadores que reservaron pueden opinar. Calidad garantizada.',
  },
  {
    icon: 'bar_chart',
    title: 'Dashboard para dueños',
    desc: 'Métricas de ocupación, ingresos y reservas desde un solo lugar.',
  },
]

const stats = [
  { value: '< 1 min', label: 'Para completar una reserva' },
  { value: '24/7', label: 'Disponibilidad online' },
  { value: '100%', label: 'Digital y automático' },
]

export default function LandingPage() {
  redirect('/login')
  return (
    <main className="min-h-screen bg-surface-bg flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-surface-border sticky top-0 z-50 glass-dark">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center">
            <span
              className="material-symbols-outlined text-surface-bg"
              style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}
            >
              sports_soccer
            </span>
          </div>
          <span className="font-montserrat text-lg font-bold text-text-primary">Pitch Pass</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5"
          >
            Iniciar sesión
          </Link>
          <Link href="/register" className="btn-primary text-sm py-1.5 px-4">
            Registrarse gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-10 py-24 relative overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(195,244,0,0.06) 0%, transparent 70%)',
          }}
        />

        {/* Live badge */}
        <div className="badge badge-green text-xs gap-1.5 animate-fade-in">
          <span className="live-dot" />
          Disponibilidad en tiempo real
        </div>

        <div className="max-w-3xl animate-slide-up">
          <h1 className="font-montserrat text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
            Reservá tu cancha{' '}
            <span className="text-brand-primary">en segundos</span>
          </h1>
          <p className="mt-6 text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Sin WhatsApp. Sin llamadas. Sin esperas. Disponibilidad actualizada al instante,
            confirmación automática y QR de acceso.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 animate-slide-up">
          <Link href="/register" className="btn-primary px-8 py-3 text-base font-semibold">
            Empezar gratis
          </Link>
          <Link href="/courts" className="btn-secondary px-8 py-3 text-base">
            Ver canchas disponibles
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg w-full mt-4">
          {stats.map((s) => (
            <div key={s.label} className="card text-center py-4">
              <div className="font-montserrat text-2xl font-bold text-brand-primary tabular-nums">
                {s.value}
              </div>
              <div className="text-text-muted text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 py-20 border-t border-surface-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-montserrat text-3xl font-bold text-text-primary">
              Todo lo que necesitás
            </h2>
            <p className="text-text-secondary mt-3">
              Una plataforma completa para jugadores y dueños de canchas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-elevated p-5 group hover:border-brand-primary/30 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <span
                    className="material-symbols-outlined text-brand-primary"
                    style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                  >
                    {f.icon}
                  </span>
                </div>
                <h3 className="font-semibold text-text-primary mb-1">{f.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-6 py-20 border-t border-surface-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-montserrat text-3xl font-bold text-text-primary mb-4">
            ¿Listo para jugar?
          </h2>
          <p className="text-text-secondary mb-8">
            Registrate gratis. Primera reserva en menos de un minuto.
          </p>
          <Link href="/register" className="btn-primary px-10 py-3 text-base font-semibold">
            Crear cuenta gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border px-6 py-6 flex items-center justify-between text-text-muted text-xs">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-brand-primary"
            style={{ fontSize: '16px', fontVariationSettings: "'FILL' 1" }}
          >
            sports_soccer
          </span>
          <span className="font-montserrat font-semibold text-text-secondary">Pitch Pass</span>
        </div>
        <span>© {new Date().getFullYear()} Pitch Pass. Todos los derechos reservados.</span>
      </footer>
    </main>
  )
}
