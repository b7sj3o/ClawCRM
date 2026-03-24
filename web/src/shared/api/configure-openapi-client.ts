import { client } from '@/shared/api/openapi/client.gen'
import { httpClient } from '@/shared/api/http/http-client'

let configured = false

export function configureOpenApiClient() {
  if (configured) {
    return
  }

  client.setConfig({
    axios: httpClient,
    baseURL: httpClient.defaults.baseURL,
  })

  configured = true
}

