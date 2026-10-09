import { ShieldAlert } from 'lucide-react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { buttonClasses } from '../components/atoms/buttonStyles'
import { selectCurrentUser } from '../features/auth/authSelectors'
import { homePathFor } from '../services/authService'
import type { Role } from '../types/common'

interface PrivateRouteProps {
  role: Role
}

/**
 * Guards a group of routes:
 * - guests are sent to /login (and brought back after signing in)
 * - signed-in users with the wrong role see an "access denied" message
 */
export default function PrivateRoute({ role }: PrivateRouteProps) {
  const user = useAppSelector(selectCurrentUser)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  if (user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center">
          <span className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <ShieldAlert aria-hidden="true" className="size-6" />
          </span>
          <h1 className="text-lg font-semibold text-slate-900">Access denied</h1>
          <p className="mt-2 text-sm text-slate-600">
            This page is for {role === 'ADMIN' ? 'administrators' : 'customers'} only. You are signed in as{' '}
            <span className="font-medium">{user.email}</span>.
          </p>
          <Link to={homePathFor(user)} className={buttonClasses('primary', 'md', 'mt-6')}>
            Go to my dashboard
          </Link>
        </div>
      </div>
    )
  }

  return <Outlet />
}
