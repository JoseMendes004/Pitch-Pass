'use client'

import { useRef, useState } from 'react'
import apiClient from '@/lib/api-client'
import { toast } from 'sonner'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface Props {
  images: string[]
  onChange: (images: string[]) => void
}

export default function ImageUploader({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const form = new FormData()
        form.append('file', file)
        const { data } = await apiClient.post('/uploads/image', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        uploaded.push(data.data.url)
      }
      onChange([...images, ...uploaded])
    } catch {
      toast.error('Error al subir imagen')
    } finally {
      setUploading(false)
    }
  }

  const remove = (url: string) => onChange(images.filter((u) => u !== url))

  return (
    <div className="space-y-3">
      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url) => (
            <div key={url} className="relative group aspect-video rounded-xl overflow-hidden border border-surface-border">
              <img
                src={url.startsWith('/uploads') ? `${API_URL}${url}` : url}
                alt="cancha"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined text-white text-[14px]">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border-2 border-dashed border-surface-border rounded-xl py-6 flex flex-col items-center gap-2 text-text-muted hover:border-brand-primary/40 hover:text-brand-primary transition-colors disabled:opacity-50"
      >
        {uploading ? (
          <>
            <span className="material-symbols-outlined text-[28px] animate-spin">progress_activity</span>
            <span className="text-xs">Subiendo...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[28px]">add_photo_alternate</span>
            <span className="text-xs font-medium">Agregar imágenes</span>
            <span className="text-[10px]">PNG, JPG hasta 5MB</span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
