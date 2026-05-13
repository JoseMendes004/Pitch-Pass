import Sidebar from '@/components/layout/navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen relative">
      <img
        src="/Gemini_Generated_Image_9tgrmp9tgrmp9tgr.png"
        alt=""
        className="fixed inset-0 w-full h-full object-cover -z-10"
      />
      <div className="fixed inset-0 bg-black/60 -z-10" />
      <Sidebar />
      <main className="flex-1 ml-56 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
