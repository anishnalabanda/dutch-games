/**
 * One multiple-choice question from the owner's KNM book (*NT2 KNM 1000
 * vragen*, AGENTS.md section 9). The text is as printed; only the answer may
 * differ from the book's key, and then `bookAnswer` and `note` say so.
 */
export interface KnmQuestion {
  /** `<theme>-<n>`, stable so saved progress survives edits. */
  id: string
  /** Its number in the book, within the theme. */
  n: number
  /** Dutch, as printed. */
  question: string
  /** Dutch, in the book's order (A, B, C). */
  options: string[]
  /** Index into `options` of the right answer. */
  answer: number
  /** The book's key, only when it disagrees with `answer`. */
  bookAnswer?: number
  /** English: why the answer differs from the book, or what has changed since it was printed. */
  note?: string
}
