import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { PageLoader } from '../components/ui/Loading'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (user === undefined) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return children
}
