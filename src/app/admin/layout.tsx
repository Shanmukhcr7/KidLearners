import { AdminSidebar } from '@/components/admin/Sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row relative overflow-hidden">
      {/* Ambient background meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[150px] pointer-events-none translate-y-1/3" />
      
      {/* Sidebar navigation */}
      <AdminSidebar />
      
      {/* Main content area */}
      <div className="flex-1 lg:h-screen lg:overflow-y-auto relative z-10 pt-16 lg:pt-0">
        <main className="p-6 lg:p-10 max-w-7xl mx-auto min-h-full">
          {children}
        </main>
      </div>
    </div>
  )
}
