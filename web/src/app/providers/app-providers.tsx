import { ClerkProvider, useAuth } from '@clerk/react'
import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/app/router/router'
import { configureOpenApiClient } from '@/shared/api/configure-openapi-client'
import { setAccessTokenResolver } from '@/shared/api/http/token-resolver'
import { env } from '@/shared/config/env'

function ApiBridge() {
  const { getToken } = useAuth()

  useEffect(() => {
    configureOpenApiClient()
    setAccessTokenResolver(() => getToken({ skipCache: true }))

    return () => {
      setAccessTokenResolver(null)
    }
  }, [getToken])

  return <RouterProvider router={router} />
}

export function AppProviders() {
  return (
    <ClerkProvider
      publishableKey={env.clerkPublishableKey}
      appearance={{
        elements: {
          modalBackdrop: 'bg-black/75! backdrop-blur-sm!',
        },
      }}
    >
      <ApiBridge />
    </ClerkProvider>
  )
}

