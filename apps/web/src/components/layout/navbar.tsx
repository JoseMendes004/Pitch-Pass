'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import Logo from './logo'

const navItems = [
  { href: '/courts', label: 'Canchas', icon: 'sports_soccer' },
  { href: '/my-bookings', label: 'Mis reservas', icon: 'event_note', requiresAuth: true },
]

const ownerItems = [
  { href: '/panel', label: 'Dashboard', icon: 'dashboard' },
  { href: '/panel/courts', label: 'Mis canchas', icon: 'stadium' },
  { href: '/panel/slots', label: 'Horarios', icon: 'calendar_month' },
  { href: '/panel/bookings', label: 'Reservas', icon: 'confirmation_number' },
]


export default function Sidebar() {
  const { profile, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  const isOwnerOrAdmin = profile?.role === 'ADMIN'

  const visibleItems = isOwnerOrAdmin
    ? []
    : navItems.filter((item) => {
        if (item.requiresAuth && !profile) return false
        return true
      })

  const NavLink = ({
    href,
    label,
    icon,
  }: {
    href: string
    label: string
    icon: string
  }) => {
    const active = pathname === href || (href !== '/panel' && pathname.startsWith(href + '/'))
    return (
      <Link
        href={href}
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
          active
            ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
            : 'text-text-muted hover:bg-surface-elevated hover:text-text-primary'
        }`}
      >
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '18px',
            fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          {icon}
        </span>
        {label}
        {active && (
          <span className="ml-auto w-1 h-1 rounded-full bg-brand-primary" />
        )}
      </Link>
    )
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-56 border-r border-surface-border flex flex-col z-50"
      style={{ background: '#0f1208' }}>

      {/* Logo */}
      <div className="px-4 py-5 border-b border-surface-border">
        <Logo size={48} />
      </div>

      {/* CTA */}

      {/* Main nav */}
      <nav className="flex-1 px-2 py-2 overflow-y-auto space-y-0.5">
        {visibleItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}

        {/* Owner section */}
        {isOwnerOrAdmin && (
          <>
            <div className="pt-4 pb-1 px-3">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                Gestión
              </span>
            </div>
            {ownerItems.map((item) => (
              <NavLink key={item.href} {...item} />
            ))}
          </>
        )}

      </nav>

      {/* Bottom */}
      <div className="px-2 pb-3 border-t border-surface-border pt-2 space-y-0.5">
        <button className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-text-muted hover:bg-surface-elevated hover:text-text-primary transition-all w-full text-left">
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          Soporte
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] font-medium text-text-muted hover:bg-danger/10 hover:text-danger transition-all w-full text-left"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          Salir
        </button>

        {/* User chip */}
        {profile && (
          <div className="mt-2 mx-1 px-3 py-2.5 rounded-lg bg-surface-elevated border border-surface-border flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center shrink-0">
              <span
                className="material-symbols-outlined text-brand-primary"
                style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}
              >
                person
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold text-text-primary truncate">{profile.displayName}</p>
              <p className="text-[10px] text-text-muted truncate capitalize">
                {profile.role === 'PLAYER' ? 'Jugador' : 'Admin'}
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}
