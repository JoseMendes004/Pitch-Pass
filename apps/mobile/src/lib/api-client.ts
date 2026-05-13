import axios from 'axios'

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3001'

const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
})

let tokenGetter: (() => Promise<string | null>) | null = null

export function setTokenGetter(fn: () => Promise<string | null>) {
  tokenGetter = fn
}

apiClient.interceptors.request.use(async (config) => {
  if (tokenGetter) {
    const token = await tokenGetter()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default apiClient
