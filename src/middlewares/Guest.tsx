import { useSelector } from 'react-redux'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectUser } from '@/store/auth.ts'

export default function Auth() {
  const location = useLocation()

  const user = useSelector(selectUser)

  return user ? (
    <Navigate to='/' state={{ from: location }} replace />
  ) : (
    <Outlet />
  )
}
