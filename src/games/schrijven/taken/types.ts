/**
 * The shape of an exam writing task, shared by the three text games (formal
 * e-mail, informal message, wijkkrant). The form game has its own types in
 * `formulieren/data.ts` but uses the same `Picture` and `Issue`.
 */

/** A picture the brief shows instead of words, as on the exam. */
export interface Picture {
  /** Emoji standing in for the exam's photo. */
  icons: string
  /** English: what the picture shows, as a tooltip. Names the thing, never the Dutch. */
  shows: string
}

/** One thing the examiner checks the text for. */
export interface Point {
  id: string
  /** English: the point, as the checklist and the hints name it. */
  label: string
  /**
   * Regex fragments, each matched from a word start; any one is enough. Kept
   * generous on purpose: a point the checker misses can be ticked off by hand.
   */
  keywords: string[]
  /** Dutch: how a sentence for this point can begin. Hint level 2. */
  starter: string
  /** Dutch: one whole sentence for it. Hint level 3. */
  example: string
}

/** What the exam prints around the space the candidate writes in. */
export type Frame =
  | { kind: 'mail'; to: string; subject: string; greeting: string; closing: string }
  | { kind: 'note'; greeting: string; closing: string[] }
  | { kind: 'krant'; lead: string }

/**
 * Who the text speaks as and to: `u` for meneer/mevrouw + surname, `je` for a
 * first name, `ik` for a wijkkrant text about yourself.
 */
export type Register = 'u' | 'je' | 'ik'

export interface TextTask {
  id: string
  /** Dutch, as printed above the task. */
  title: string
  /** The DUO oefenexamen this task is modelled on, if any. */
  exam?: 1 | 2 | 3
  /** Dutch: the situation, in the exam's own "U ..." voice. */
  situation: string
  pictures?: Picture[]
  /** Dutch: the line before the bullets, such as "Schrijf minimaal drie zinnen op. Denk aan:". */
  intro?: string
  /** Dutch: the bullet points, or the "Denk aan" questions. */
  bullets: string[]
  /** Dutch: the instruction lines after the bullets. */
  instructions: string[]
  frame: Frame
  register: Register
  points: Point[]
  minSentences: number
  /** Dutch: the body only. The printed greeting and closing are not part of it. */
  model: string
}

/** One thing the hint panel can point at. */
export interface Issue {
  id: string
  /** Must be fixed (or ticked off) before the task counts as done. Advice never blocks. */
  blocking: boolean
  /** English, one line. */
  title: string
  /** English: what to do. Hint level 1. */
  explain: string
  /** Dutch: how to begin. Hint level 2. */
  starter?: string
  /** Dutch: a whole sentence or value to adapt. Hint level 3. */
  example?: string
  /** The form field or question this is about, so the form can mark it. */
  target?: string
}
