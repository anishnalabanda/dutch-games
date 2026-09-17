import type { ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  tone?: 'default' | 'ok' | 'alert'
}

export function Tag({ children, tone = 'default' }: TagProps) {
  return <span className={`tag tag-${tone}`}>{children}</span>
}
