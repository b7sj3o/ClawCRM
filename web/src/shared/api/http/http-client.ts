import axios from 'axios'

import { env } from '@/shared/config/env'

import { resolveAccessToken } from './token-resolver'

export const httpClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
})

httpClient.interceptors.request.use(async (config) => {
  const token = await resolveAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

