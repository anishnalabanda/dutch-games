import { GlossedText } from '../components/GlossedText'
import { SentenceSlots } from '../components/SentenceSlots'
import type { Correction, Review, SuggestedAnswer, Verdict } from './feedback'
import './ai.css'

const VERDICT: Record<Verdict, { label: string; tone: string }> = {
  likely_pass: { label: 'Likely to pass', tone: 'ai-verdict-ok' },
  borderline: { label: 'Borderline', tone: 'ai-verdict-mid' },
  not_yet: { label: 'Not yet', tone: 'ai-verdict-alert' },
}

const CATEGORY: Record<Correction['category'], string> = {
  content: 'Content',
  register: 'u or je',
  word_order: 'Word order',
  verb_form: 'Verb form',
  spelling: 'Spelling',
  punctuation: 'Punctuation',
  word_choice: 'Word choice',
}

export const CLAUDE_NOTE =
  'Claude reads for meaning, but it can be wrong too. When a task counts as done is still decided by the checklist: a point Claude confirms counts as covered.'

/**
 * Claude's marking of one task: the verdict and each point, then what to
 * write (the learner's text corrected, and a stronger example), then every
 * correction with its rule.
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
  const labelled = Object.keys(parts).length > 1
  return (
    <section className="ai-review" aria-label="Claude's review">
      <div className="ai-review-head">
        <span className="g-label">{previous ? 'Feedback on your last attempt' : "Claude's review"}</span>
        <span className={`ai-verdict ${verdict.tone}`}>{verdict.label}</span>
      </div>
      {stale && !previous && <p className="ai-small">You have changed your text since this review. Press Submit to check it again.</p>}
      <p>{review.summary}</p>

      <ul className="ai-points">
        {(review.points ?? []).map((point) => (
          <li key={point.id} className={point.covered ? 'ai-point-ok' : 'ai-point-missing'}>
            <span aria-hidden="true">{point.covered ? '✓' : '✕'}</span>
            <span>
              <strong>{points[point.id] ?? point.id}</strong> {point.comment}
            </span>
          </li>
        ))}
      </ul>

      {answers.length > 0 && (
        <>
          <span className="g-label">What to write</span>
          {answers.map((answer) => (
            <SuggestedAnswerCard
              key={answer.id}
              answer={answer}
              label={labelled ? parts[answer.id] : undefined}
              fixed={corrections.length > 0}
            />
          ))}
          <p className="ai-small">
            Type the stronger answer out yourself rather than copying it: on the exam you write it by hand.
          </p>
        </>
      )}

      {corrections.length > 0 && (
        <>
          <span className="g-label">Why: the corrections</span>
          <ul className="tk-issues">
            {corrections.map((c, i) => (
              <li key={`${i}-${c.original}`}>
                <strong>{CATEGORY[c.category] ?? c.category}</strong>
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
        </>
      )}

      <p className="tk-honesty">{CLAUDE_NOTE}</p>
    </section>
  )
}

const same = (a: string, b: string) => a.trim().replace(/\s+/g, ' ') === b.trim().replace(/\s+/g, ' ')

/**
 * What to write for one question (or the whole text): the learner's own
 * sentence fixed, then a stronger example, each labelled so it is clear which
 * is which. Either is left out when it would only repeat the other. Last, the
 * sentences cut into slots with why they stand in that order.
 */
function SuggestedAnswerCard({ answer, label, fixed }: { answer: SuggestedAnswer; label?: string; fixed: boolean }) {
  const stronger = answer.example.trim() !== '' && !same(answer.example, answer.corrected)
  const sentences = (answer.sentences ?? []).filter((s) => (s.slots ?? []).length > 0)
  return (
    <div className="g-worksheet ai-answer">
      {label && (
        <p className="ai-answer-question">
          <GlossedText text={label} />
        </p>
      )}
      <div className="ai-answer-row">
        <span className="ai-answer-tag">{fixed ? 'Your answer, corrected' : 'Your answer is correct'}</span>
        <p className="tk-model">
          <GlossedText text={answer.corrected} />
        </p>
      </div>
      {stronger && (
        <div className="ai-answer-row ai-answer-better">
          <span className="ai-answer-tag">Stronger answer</span>
          <p className="tk-model">
            <GlossedText text={answer.example} />
          </p>
        </div>
      )}
      {answer.why && <p className="ai-answer-why">{answer.why}</p>}
      {sentences.length > 0 && (
        <div className="ai-build">
          <span className="ai-answer-tag">
            {sentences.length > 1 ? 'How the sentences are built' : 'How the sentence is built'}
          </span>
          {sentences.map((sentence, i) => (
            <div key={i} className="ai-build-sentence">
              <SentenceSlots slots={sentence.slots ?? []} />
              {sentence.rule && <p className="ai-answer-why">{sentence.rule}</p>}
            </div>
          ))}
        </div>
      )}
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
