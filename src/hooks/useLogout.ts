import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { loggedOut } from '../features/auth/authSlice'
import { useToast } from './useToast'

export function useLogout() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()

  return () => {
    dispatch(loggedOut())
    navigate('/login', { replace: true })
    showToast('You have been logged out.', 'info')
  }
}
