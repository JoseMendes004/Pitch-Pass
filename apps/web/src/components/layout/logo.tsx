'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface LogoProps {
  className?: string
  size?: number
  showText?: boolean
}

export default function Logo({ className = '', size = 32, showText = true }: LogoProps) {
  const [error, setError] = useState(false)

  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <div 
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        {!error ? (
          <Image
            src="/logo.png"
            alt="PitchPass Logo"
            width={size}
            height={size}
            className="object-contain"
            priority
            onError={() => setError(true)}
          />
        ) : (
          <div 
            className="rounded-lg bg-brand-primary flex items-center justify-center shadow-brand-glow-sm"
            style={{ width: size, height: size }}
          >
            <span
              className="material-symbols-outlined text-surface-bg"
              style={{ fontSize: size * 0.5, fontVariationSettings: "'FILL' 1" }}
            >
              sports_soccer
            </span>
          </div>
        )}
      </div>
      {showText && (
        <div>
          <span className="font-montserrat font-bold text-xl text-text-primary leading-tight block">
            Pitch Pass
          </span>
        </div>
      )}
    </Link>
  )
}
