// Dashboard uses its own nav (built into the page), no shared layout wrapper needed
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
