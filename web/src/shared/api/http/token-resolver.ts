let accessTokenResolver: (() => Promise<string | null>) | null = null

export function setAccessTokenResolver(resolver: (() => Promise<string | null>) | null) {
  accessTokenResolver = resolver
}

export async function resolveAccessToken() {
  if (!accessTokenResolver) {
    return null
  }

  return accessTokenResolver()
}

