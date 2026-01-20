import { api } from './api'
import type { Task } from '../types/task'

export async function listTasks() {
  const { data } = await api.get('/tasks')
  return data as Task[]
}

export async function createTask(input: { title: string; description?: string; status: string }) {
  const { data } = await api.post('/tasks', input)
  return data as Task
}