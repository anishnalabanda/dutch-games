import { GlossedText } from '../components/GlossedText'
import { SentenceSlots } from '../components/SentenceSlots'
import type { Review, SuggestedAnswer, Verdict } from './feedback'
import './ai.css'

const VERDICT: Record<Verdict, { label: string; tone: string }> = {
  likely_pass: { label: 'Likely to pass', tone: 'ai-verdict-ok' },
  borderline: { label: 'Borderline', tone: 'ai-verdict-mid' },
  not_yet: { label: 'Not yet', tone: 'ai-verdict-alert' },
}

export const CLAUDE_NOTE =
  'Claude reads for meaning, but it can be wrong too. When a task counts as done is still decided by the checklist: a point Claude confirms counts as covered.'

/**
 * Claude's marking of one task, kept to two parts: the verdict and any point
 * still missing, then how to build the sentences to write, then the
 * corrections. Covered points are not listed: the verdict already says so.
 */
export function ClaudeReview({
  review,
  stale,
  previous = false,
  points,
  parts,
}: {
  review: Review
  stale: boolean
  /** Shown while the task is written again: feedback on the last attempt, not on this text. */
  previous?: boolean
  /** id to label, for the points Claude reports on. */
  points: Record<string, string>
  /** id to label, for the suggested answers; one part needs no label. */
  parts: Record<string, string>
}) {
  const verdict = VERDICT[review.verdict] ?? VERDICT.borderline
  // Defaults, in case an answer comes back short of a field.
  const answers = review.answers ?? []
  const corrections = review.corrections ?? []
  const missing = (review.points ?? []).filter((p) => !p.covered)
  const labelled = Object.keys(parts).length > 1
  return (
    <section className="ai-review" aria-label="Claude's review">
      <div className="ai-review-head">
        <span className="g-label">{previous ? 'Feedback on your last attempt' : "Claude's review"}</span>
        <span className={`ai-verdict ${verdict.tone}`}>{verdict.label}</span>
      </div>
      {stale && !previous && <p className="ai-small">You have changed your text since this review. Press Submit to check it again.</p>}
      <p>{review.summary}</p>

      {missing.length > 0 && (
        <ul className="ai-points">
          {missing.map((point) => (
            <li key={point.id} className="ai-point-missing">
              <span aria-hidden="true">✕</span>
              <span>
                <strong>{points[point.id] ?? point.id}</strong> {point.comment}
              </span>
            </li>
          ))}
        </ul>
      )}

      {answers.length > 0 && (
        <>
          <span className="g-label">1. Sentence formation</span>
          <p className="ai-small">Numbers are the word order. Blue is a verb: the main verb stands 2nd, any other verb goes last.</p>
          {answers.map((answer) => (
            <SentenceCard key={answer.id} answer={answer} label={labelled ? parts[answer.id] : undefined} />
          ))}
        </>
      )}

      <span className="g-label">2. Corrections</span>
      {corrections.length > 0 ? (
        <ul className="ai-fixes">
          {corrections.map((c, i) => (
            <li key={`${i}-${c.original}`}>
              <div className="ai-fix">
                <span className="ai-fix-from">
                  <GlossedText text={c.original} />
                </span>
                <span className="ai-fix-arrow" aria-label="becomes">
                  →
                </span>
                <span className="ai-fix-to">
                  <GlossedText text={c.corrected} />
                </span>
              </div>
              <p>{c.explain}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="ai-small">None: nothing an examiner would mark.</p>
      )}

      <p className="tk-honesty">{CLAUDE_NOTE}</p>
    </section>
  )
}

const same = (a: string, b: string) => a.trim().replace(/\s+/g, ' ') === b.trim().replace(/\s+/g, ' ')

/**
 * The answer to write for one question (or the whole text), as its sentences
 * cut into slots, each with one line on why. The whole answer is printed as
 * well only when the slots do not already spell it out, as in a long e-mail.
 */
function SentenceCard({ answer, label }: { answer: SuggestedAnswer; label?: string }) {
  const sentences = (answer.sentences ?? []).filter((s) => (s.slots ?? []).length > 0)
  const built = sentences.map((s) => s.slots.map((slot) => slot.text).join(' ')).join(' ')
  const text = answer.example?.trim() ?? ''
  return (
    <div className="g-worksheet ai-answer">
      {label && (
        <p className="ai-answer-question">
          <GlossedText text={label} />
        </p>
      )}
      {text !== '' && !same(text, built) && (
        <p className="tk-model">
          <GlossedText text={text} />
        </p>
      )}
      {sentences.map((sentence, i) => (
        <div key={i} className="ai-build-sentence">
          <SentenceSlots slots={sentence.slots} />
          {sentence.rule && <p className="ai-answer-why">{sentence.rule}</p>}
        </div>
      ))}
    </div>
  )
}

/** One line while Claude is working, or why it failed. */
export function ClaudeStatus({ busy, error }: { busy: 'hint' | 'review' | null; error: string | null }) {
  if (busy) {
    return (
      <p className="ai-status" role="status">
        Claude is reading your text…
      </p>
    )
  }
  if (error) {
    return (
      <p className="ai-error" role="status">
        {error} The pattern checks are used instead.
      </p>
    )
  }
  return null
}
