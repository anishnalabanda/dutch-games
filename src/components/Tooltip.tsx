import { useId, useState, type ReactNode } from 'react'

interface TooltipProps {
  content: string
  /** Where the bubble sits. Use 'below' near the top of the screen. */
  placement?: 'above' | 'below'
  children: ReactNode
}

export function Tooltip({ content, placement = 'above', children }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const id = useId()
  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      aria-describedby={id}
    >
      {children}
      {visible && (
        <span role="tooltip" id={id} className={`tooltip-bubble tooltip-bubble-${placement}`}>
          {content}
        </span>
      )}
    </span>
  )
}
