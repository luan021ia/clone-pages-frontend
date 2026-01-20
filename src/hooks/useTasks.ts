import { useEffect, useState } from 'react'
import { createTask, listTasks } from '../services/tasks'
import type { Task } from '../types/task'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  async function reload() {
    setLoading(true)
    const data = await listTasks()
    setTasks(data)
    setLoading(false)
  }

  async function add(title: string) {
    if (!title) return
    await createTask({ title, status: 'open' })
    await reload()
  }

  useEffect(() => {
    reload()
  }, [])

  return { tasks, loading, add, reload }
}