'use client'

import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import apiClient from '@/lib/api-client'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend,
} from 'recharts'

interface Stats {
  totalCourts: number
  totalBookings: number
  confirmedToday: number
  revenue: number
}

interface AnalyticsData {
  byHour: { hour: string; reservas: number }[]
  byDay: { dia: string; ingresos: number }[]
  byStatus: { name: string; value: number }[]
}

const quickLinks = [
  {
    href: '/panel/courts/new',
    icon: 'add_circle',
    label: 'Nueva cancha',
    desc: 'Registrá una cancha nueva',
    accent: true,
  },
  {
    href: '/panel/courts',
    icon: 'stadium',
    label: 'Mis canchas',
    desc: 'Gestionar canchas existentes',
    accent: false,
  },
  {
    href: '/panel/slots',
    icon: 'calendar_month',
    label: 'Horarios',
    desc: 'Generar y gestionar slots',
    accent: false,
  },
  {
    href: '/panel/bookings',
    icon: 'confirmation_number',
    label: 'Reservas',
    desc: 'Ver reservas activas',
    accent: false,
  },
]

const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: '#c3f400',
  PENDING: '#f59e0b',
  CANCELLED: '#ef4444',
}

export default function PanelPage() {
  const { profile, firebaseUser, loading: authLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    if (profile && profile.role !== 'ADMIN') {
      router.replace('/courts')
    }
  }, [profile, router])

  useEffect(() => {
    if (authLoading || !firebaseUser) return
    Promise.all([
      apiClient.get('/courts/owner/mine'),
      apiClient.get('/bookings/all'),
    ]).then(([courtsRes, bookingsRes]) => {
      const courts = courtsRes.data.data ?? []
      const bookings = bookingsRes.data.data ?? []
      const today = new Date().toISOString().split('T')[0]
      const confirmedToday = bookings.filter((b: any) =>
        b.status === 'CONFIRMED' && b.createdAt?.startsWith(today)
      ).length
      const revenue = bookings
        .filter((b: any) => b.status === 'CONFIRMED')
        .reduce((sum: number, b: any) => sum + parseFloat(b.totalAmount ?? 0), 0)
      setStats({ totalCourts: courts.length, totalBookings: bookings.length, confirmedToday, revenue })

      // Analytics
      const hourMap: Record<number, number> = {}
      const dayMap: Record<number, number> = {}
      const statusMap: Record<string, number> = {}

      bookings.forEach((b: any) => {
        // by hour (from slot startTime or createdAt)
        const timeStr = b.startTime ?? b.createdAt
        if (timeStr) {
          const h = new Date(timeStr).getHours()
          hourMap[h] = (hourMap[h] ?? 0) + 1
        }
        // by day of week (revenue)
        if (b.status === 'CONFIRMED' && b.createdAt) {
          const d = new Date(b.createdAt).getDay()
          dayMap[d] = (dayMap[d] ?? 0) + parseFloat(b.totalAmount ?? 0)
        }
        // by status
        const s = b.status ?? 'UNKNOWN'
        statusMap[s] = (statusMap[s] ?? 0) + 1
      })

      const byHour = Array.from({ length: 24 }, (_, i) => ({
        hour: `${i}h`,
        reservas: hourMap[i] ?? 0,
      })).filter((_, i) => i >= 6 && i <= 22)

      const byDay = DAYS.map((dia, i) => ({
        dia,
        ingresos: Math.round((dayMap[i] ?? 0) * 100) / 100,
      }))

      const byStatus = Object.entries(statusMap).map(([name, value]) => ({ name, value }))

      setAnalytics({ byHour, byDay, byStatus })
    }).catch(() => {})
  }, [firebaseUser, authLoading])

  if (!profile) return null
  if (profile.role !== 'ADMIN') return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Bienvenido, {profile.displayName?.split(' ')[0] ?? 'Dueño'}
        </p>
      </div>

      {/* Stats bento */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="stat-label">Canchas</span>
            <span
              className="material-symbols-outlined text-brand-primary"
              style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
            >
              stadium
            </span>
          </div>
          <div className="stat-value">{stats?.totalCourts ?? '—'}</div>
          <p className="text-text-muted text-xs mt-1">registradas</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="stat-label">Reservas hoy</span>
            <span
              className="material-symbols-outlined text-brand-primary"
              style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
            >
              confirmation_number
            </span>
          </div>
          <div className="stat-value">{stats?.confirmedToday ?? '—'}</div>
          <p className="text-text-muted text-xs mt-1">confirmadas</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="stat-label">Total reservas</span>
            <span
              className="material-symbols-outlined text-brand-primary"
              style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
            >
              bar_chart
            </span>
          </div>
          <div className="stat-value">{stats?.totalBookings ?? '—'}</div>
          <p className="text-text-muted text-xs mt-1">histórico</p>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="stat-label">Ingresos</span>
            <span
              className="material-symbols-outlined text-brand-primary"
              style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
            >
              payments
            </span>
          </div>
          <div className="stat-value text-brand-primary">
            {stats ? formatCurrency(stats.revenue) : '—'}
          </div>
          <p className="text-text-muted text-xs mt-1">este mes</p>
        </div>
      </div>

      {/* Quick access */}
      <div>
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
          Accesos rápidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`card-elevated p-4 group hover:border-brand-primary/30 transition-all duration-200 flex items-center gap-4 ${
                link.accent ? 'border-brand-primary/20 bg-brand-primary/5' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  link.accent
                    ? 'bg-brand-primary text-surface-bg shadow-brand-glow-sm'
                    : 'bg-surface-elevated border border-surface-border text-text-secondary group-hover:text-brand-primary group-hover:border-brand-primary/30 transition-colors'
                }`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                >
                  {link.icon}
                </span>
              </div>
              <div className="min-w-0">
                <p className={`font-semibold text-sm ${link.accent ? 'text-brand-primary' : 'text-text-primary group-hover:text-brand-primary transition-colors'}`}>
                  {link.label}
                </p>
                <p className="text-text-muted text-xs mt-0.5 truncate">{link.desc}</p>
              </div>
              <span
                className="material-symbols-outlined text-text-muted ml-auto shrink-0 group-hover:text-brand-primary transition-colors"
                style={{ fontSize: '18px' }}
              >
                chevron_right
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Analytics */}
      <div>
        <h2 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">
          Analytics
        </h2>
        {!analytics ? (
          <div className="card text-center py-10 text-text-muted text-sm">Cargando...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Ocupación por hora */}
            <div className="card p-4">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-4">
                Ocupación por hora
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={analytics.byHour} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="hour" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval={2} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1d10', border: '1px solid #2d3320', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#c3f400' }}
                    itemStyle={{ color: '#e5e7eb' }}
                  />
                  <Bar dataKey="reservas" fill="#c3f400" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue por día */}
            <div className="card p-4">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-4">
                Ingresos por día de semana
              </p>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={analytics.byDay} margin={{ top: 0, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2d3320" />
                  <XAxis dataKey="dia" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#1a1d10', border: '1px solid #2d3320', borderRadius: 8, fontSize: 12 }}
                    labelStyle={{ color: '#c3f400' }}
                    itemStyle={{ color: '#e5e7eb' }}
                    formatter={(v: any) => [`$${v}`, 'Ingresos']}
                  />
                  <Line type="monotone" dataKey="ingresos" stroke="#c3f400" strokeWidth={2} dot={{ fill: '#c3f400', r: 3 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Estado de reservas */}
            <div className="card p-4 lg:col-span-2">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-4">
                Distribución por estado
              </p>
              {analytics.byStatus.length === 0 ? (
                <p className="text-text-muted text-sm text-center py-8">Sin reservas aún</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={analytics.byStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {analytics.byStatus.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.name] ?? '#6b7280'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ background: '#1a1d10', border: '1px solid #2d3320', borderRadius: 8, fontSize: 12 }}
                      itemStyle={{ color: '#e5e7eb' }}
                    />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(v) => <span style={{ color: '#9ca3af', fontSize: 12 }}>{v}</span>}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
