interface FeedbackBoxProps {
  correct: boolean
  /** Written in English: the grammar has to land, not be decoded first. */
  message: string
}

export function FeedbackBox({ correct, message }: FeedbackBoxProps) {
  return (
    <div className={`feedback-box ${correct ? 'feedback-ok' : 'feedback-alert'}`} role="status">
      <strong>{correct ? 'Correct' : 'Not quite'}</strong>
      <p>{message}</p>
    </div>
  )
}
