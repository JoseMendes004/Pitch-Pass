'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import apiClient from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import Logo from '@/components/layout/logo'
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user } = await createUserWithEmailAndPassword(auth, form.email, form.password)
      await updateProfile(user, { displayName: form.name })
      const idToken = await user.getIdToken()
      await apiClient.post('/auth/verify', { idToken, role: 'PLAYER' })
      router.push('/courts')
    } catch {
      toast.error('Error al crear la cuenta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center overflow-hidden relative py-10">
      {/* Background */}
      <div className="absolute inset-0 bg-surface-bg">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(195,244,0,0.08) 0%, transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(0deg, transparent 49%, #c3f400 49%, #c3f400 51%, transparent 51%),
              linear-gradient(90deg, transparent 49%, #c3f400 49%, #c3f400 51%, transparent 51%)
            `,
            backgroundSize: '120px 120px',
          }}
        />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass rounded-2xl p-8 flex flex-col gap-6 shadow-glass-lg">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Logo size={64} showText={false} />
            <div className="text-center">
              <h1 className="font-montserrat text-xl font-bold text-text-primary">Pitch Pass</h1>
              <p className="text-text-muted text-sm mt-0.5">Reservas de canchas en tiempo real</p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="font-montserrat text-2xl font-bold text-text-primary">Crear cuenta</h2>
            <p className="text-text-secondary text-sm mt-1">Gratis. Listo en menos de 1 minuto.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide" htmlFor="name">
                Nombre completo
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                  person
                </span>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide" htmlFor="email">
                Correo electrónico
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                  mail
                </span>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="input-field pl-10"
                  placeholder="juan@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                  lock
                </span>
                <input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="input-field pl-10"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full h-11 mt-1 flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-text-secondary text-sm">
            ¿Ya tenés cuenta?{' '}
            <Link href="/login" className="text-brand-primary font-semibold hover:text-brand-dim transition-colors">
              Iniciar sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
