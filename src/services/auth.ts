import { api } from './api'

export async function login(email: string, password: string) {
  const { data } = await api.post('/users/login', { email, password })
  localStorage.setItem('token', data.token)
  return data as { token: string; user: { id: string; name: string; email: string } }
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post('/users', { name, email, password })
  return data
}