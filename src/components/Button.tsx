import React from 'react'

type Props = { children: React.ReactNode; onClick?: () => void }

export function Button({ children, onClick }: Props) {
  return (
    <button onClick={onClick} style={{ padding: 8, borderRadius: 6 }}>
      {children}
    </button>
  )
}