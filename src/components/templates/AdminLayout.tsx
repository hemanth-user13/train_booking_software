import { Menu } from 'lucide-react'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectCurrentUser } from '../../features/auth/authSelectors'
import { useLogout } from '../../hooks/useLogout'
import BrandMark from '../molecules/BrandMark'
import Sidebar from '../organisms/Sidebar'

export default function AdminLayout() {
  const user = useAppSelector(selectCurrentUser)
  const logout = useLogout()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!user) return null

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[15rem_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block">
        <Sidebar user={user} onLogout={logout} />
      </aside>

      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
        <BrandMark />
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Open admin menu"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" aria-hidden="true" onClick={() => setMobileOpen(false)} />
          <div className="relative h-full w-64">
            <Sidebar user={user} onLogout={logout} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-8">
        <Outlet />
      </main>
    </div>
  )
}
