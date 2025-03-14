import { Navigation } from "@/components/layout/Navigation"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-6">
        {children}
      </main>
    </div>
  )
} 