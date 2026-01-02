import { Navigate } from "react-router-dom"
import { isAuthenticated } from "../../lib/auth"

export default function PublicRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/home" replace />
  }

  return children
}
