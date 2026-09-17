interface StreakBadgeProps {
  label: string
  value: number
}

export function StreakBadge({ label, value }: StreakBadgeProps) {
  return (
    <div className="streak-badge">
      <span className="streak-badge-value">{value}</span>
      <span className="streak-badge-label">{label}</span>
    </div>
  )
}
