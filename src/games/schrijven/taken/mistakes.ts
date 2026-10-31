import type { Review } from '../../../ai/feedback'
import type { Issue } from './types'

/**
 * The mistakes made in the four exam-task games, kept per task so the
 * feedback page can count habits across them. One fixed list of types, so
 * Claude's corrections and the pattern checks count as the same thing.
 */

export const MISTAKE_TYPES = [
  'verb_second',
  'verb_end',
  'verb_form',
  'register',
  'spelling',
  'capital_stop',
  'de_het',
  'point',
  'word_choice',
] as const

export type MistakeType = (typeof MISTAKE_TYPES)[number]

/** English, for the feedback page. */
export const MISTAKE_LABEL: Record<MistakeType, string> = {
  verb_second: 'Main verb not 2nd',
  verb_end: 'Verb not at the end (after omdat, dat, als, or a second verb)',
  verb_form: 'Wrong verb form',
  register: 'u and je mixed up',
  spelling: 'Spelling',
  capital_stop: 'Capital letter or full stop',
  de_het: 'de or het',
  point: 'A point missing or unclear',
  word_choice: 'Wrong word',
}

/** English, one plain line: what to do instead. */
export const MISTAKE_RULE: Record<MistakeType, string> = {
  verb_second:
    'The verb that changes with the person stands 2nd, also when the sentence starts with a time or a place: Morgen ga ik.',
  verb_end: 'After omdat, dat, als and of, the verbs go to the end. A second verb goes to the end too: Ik wil tennis spelen.',
  verb_form: 'ik werk, jij werkt, hij werkt. "I am playing" is ik speel, not ik ben spelen.',
  register: 'Pick u or je from the greeting, and keep it the whole text: u and uw, or je and jouw.',
  spelling: 'Check each word letter by letter: on the exam there is no spellcheck.',
  capital_stop: 'A capital only to start a sentence and for names: after en, want and maar, ik stays small. End with a full stop.',
  de_het: 'Learn a noun with its article (de woonkamer, het huis), and do not leave the article out.',
  point: 'Answer every bullet in its own sentence, and reuse the words of the bullet.',
  word_choice: 'Use the Dutch way of saying it, not the English words one by one.',
}

/** The drill that trains each type, by manifest id; none for the ones no single game covers. */
export const MISTAKE_GAME: Partial<Record<MistakeType, string>> = {
  verb_second: 'nl.schrijven.zinnen',
  verb_end: 'nl.schrijven.voegwoorden',
  verb_form: 'nl.schrijven.werkwoorden',
  register: 'nl.schrijven.uofje',
  spelling: 'nl.schrijven.spelling',
  de_het: 'nl.schrijven.dehet',
  word_choice: 'nl.schrijven.woorden',
}

export interface Mistake {
  type: MistakeType
  /** Dutch, quoted from the learner. Never kept for the form game. */
  original?: string
  /** Dutch, the fix. */
  corrected?: string
  /** English, one line. */
  explain?: string
}

/** Task id to the mistakes of its latest attempt. */
export type MistakeLog = Record<string, Mistake[]>

/** Pattern check ids (without a form's question prefix) and the type each one is. */
const FROM_ISSUE: Record<string, MistakeType> = {
  punt: 'capital_stop',
  hoofdletter: 'capital_stop',
  inversie: 'verb_second',
  want: 'verb_second',
  omdat: 'verb_end',
  dt: 'verb_form',
  register: 'register',
  'ik-vorm': 'register',
  aantal: 'point',
  antwoord: 'point',
  lengte: 'point',
}

/**
 * Without a review, what the pattern checks found. A missing point is a
 * `punt-<id>` issue; a form's are prefixed with the question id.
 */
export function mistakesFromIssues(issues: Issue[]): Mistake[] {
  return issues.flatMap((issue) => {
    if (issue.id.startsWith('punt-')) return [{ type: 'point' as const, explain: issue.title }]
    const type = FROM_ISSUE[issue.id] ?? FROM_ISSUE[issue.id.slice(issue.id.indexOf('-') + 1)]
    return type ? [{ type, explain: issue.title }] : []
  })
}

/** With a review, Claude's corrections and the points it found missing; the patterns are not counted then. */
export function mistakesFromReview(review: Review, labels: Record<string, string>): Mistake[] {
  const corrections = (review.corrections ?? []).map((c) => ({
    type: MISTAKE_TYPES.includes(c.type) ? c.type : ('word_choice' as const),
    original: c.original,
    corrected: c.corrected,
    explain: c.explain,
  }))
  const missing = (review.points ?? [])
    .filter((p) => !p.covered)
    .map((p) => ({ type: 'point' as const, explain: `${labels[p.id] ?? p.id}: ${p.comment}` }))
  return [...missing, ...corrections]
}

/** Every slip of one attempt counts once, however many times it was submitted. */
export function mergeMistakes(a: Mistake[], b: Mistake[]): Mistake[] {
  const seen = new Set(a.map(sameKey))
  return [...a, ...b.filter((m) => !seen.has(sameKey(m)))]
}

const sameKey = (m: Mistake) => `${m.type}|${m.original ?? ''}|${m.original ? '' : (m.explain ?? '')}`
