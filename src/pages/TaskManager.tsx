import { useState } from 'react'
import { useTasks } from '../hooks/useTasks'

export function TaskManager() {
  const { tasks, add } = useTasks()
  const [title, setTitle] = useState('')

  return (
    <div style={{ padding: 24 }}>
      <h1>Tarefas</h1>
      <div style={{ display: 'flex', gap: 8 }}>
        <input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
        <button onClick={() => { add(title); setTitle('') }}>Adicionar</button>
      </div>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
    </div>
  )
}