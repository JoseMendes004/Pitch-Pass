'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import apiClient from '@/lib/api-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import Logo from '@/components/layout/logo'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      const idToken = await user.getIdToken()
      await apiClient.post('/auth/verify', { idToken })
      router.push('/courts')
    } catch {
      toast.error('Email o contraseña incorrectos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="h-screen w-full flex items-center justify-center overflow-hidden relative">
      {/* Background — football field image */}
      <div className="absolute inset-0">
        <img
          src="/Gemini_Generated_Image_111uji111uji111u.png"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="glass rounded-2xl p-8 flex flex-col gap-7 shadow-glass-lg">

          {/* Logo */}
          <div className="flex flex-col items-center gap-3">
            <Logo size={64} showText={false} />
            <div className="text-center">
              <h1 className="font-montserrat text-xl font-bold text-text-primary">
                Pitch Pass
              </h1>
              <p className="text-text-muted text-sm mt-0.5">
                Reservá tu cancha en segundos
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center">
            <h2 className="font-montserrat text-2xl font-bold text-text-primary">
              Bienvenido de vuelta
            </h2>
            <p className="text-text-secondary text-sm mt-1">
              Ingresá para ver tus canchas y reservas
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-secondary uppercase tracking-wide" htmlFor="password">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-brand-primary hover:text-brand-dim transition-colors">
                  ¿Olvidaste?
                </a>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[18px]">
                  lock
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
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
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-text-secondary text-sm">
            ¿No tenés cuenta?{' '}
            <Link href="/register" className="text-brand-primary font-semibold hover:text-brand-dim transition-colors">
              Registrarse gratis
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
