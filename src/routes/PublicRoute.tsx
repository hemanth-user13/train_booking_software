import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { selectCurrentUser } from '../features/auth/authSelectors'
import { homePathFor } from '../services/authService'

/**
 * Login and signup are only for guests. A signed-in user is sent back to the page
 * they originally asked for (if their role allows it) or to their home page.
 */
export default function PublicRoute() {
  const user = useAppSelector(selectCurrentUser)
  const location = useLocation()

  if (user) {
    const from = (location.state as { from?: string } | null)?.from
    const allowedPrefix = user.role === 'ADMIN' ? '/admin' : '/customer'
    const target = from?.startsWith(allowedPrefix) ? from : homePathFor(user)
    return <Navigate to={target} replace />
  }

  return <Outlet />
}
