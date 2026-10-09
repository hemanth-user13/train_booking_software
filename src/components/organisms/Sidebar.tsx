import { LogOut, Plus, Route } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import type { PublicUser } from '../../features/auth/authTypes'
import { cn } from '../../utils/cn'
import Avatar from '../atoms/Avatar'
import BrandMark from '../molecules/BrandMark'

const links = [
  { to: '/admin/trains', label: 'Train routes', icon: Route, end: true },
  { to: '/admin/trains/new', label: 'Add train', icon: Plus, end: true },
]

interface SidebarProps {
  user: PublicUser
  onLogout: () => void
  onNavigate?: () => void
}

export default function Sidebar({ user, onLogout, onNavigate }: SidebarProps) {
  return (
    <div className="flex h-full flex-col bg-brand-900 text-brand-100">
      <div className="px-5 py-5">
        <BrandMark inverted />
        <p className="mt-1 pl-10 text-xs uppercase tracking-wide text-brand-300">Admin console</p>
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                isActive ? 'bg-white/10 text-white' : 'text-brand-200 hover:bg-white/5 hover:text-white',
              )
            }
          >
            <Icon aria-hidden="true" className="size-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user.name}</p>
            <p className="truncate text-xs text-brand-300">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md p-2 text-brand-200 hover:bg-white/10 hover:text-white"
            aria-label="Log out"
            title="Log out"
          >
            <LogOut aria-hidden="true" className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
