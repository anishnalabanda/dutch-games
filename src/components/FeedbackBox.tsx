interface FeedbackBoxProps {
  correct: boolean
  message: string
  /** Overrides the Dutch default, for games whose feedback is written in English. */
  heading?: string
  /** English of the whole box, when the message itself is Dutch. */
  translation?: string
}

export function FeedbackBox({ correct, message, heading, translation }: FeedbackBoxProps) {
  return (
    <div className={`feedback-box ${correct ? 'feedback-ok' : 'feedback-alert'}`} role="status">
      <strong>{heading ?? (correct ? 'Goed zo' : 'Niet helemaal')}</strong>
      <p>{message}</p>
      {translation && (
        <p className="feedback-translation">
          {correct ? 'Well done' : 'Not quite'}: {translation}
        </p>
      )}
    </div>
  )
}
