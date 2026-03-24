import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router-dom'

import { AppShell } from '@/widgets/app-shell/ui/app-shell'

export function RequireAuth() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0c0c0f] text-sm text-zinc-400">
        Завантаження…
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />
  }

  return <AppShell />
}

