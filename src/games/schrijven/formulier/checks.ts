import { lookupWord } from '../../glossary'
import {
  DT_EXTRA,
  DT_MISSING,
  FRONTED,
  INFORMAL,
  SUBJECT_PRONOUNS,
  type CheckResult,
} from '../examen/checks'
import type { OpenQuestion } from './data'

export const MIN_WORDS = 4

export const ANSWER_NOTE =
  'These checks look at the form of your answer, not whether your Dutch is right. Compare it with the model answer yourself.'

/** A time or place phrase at the front, then the subject: "Op dinsdag ik kan". */
const FRONTED_PHRASE =
  /^(op|in|om|na|sinds|elke|meestal|soms|vaak)\s+((de|het|een)\s+)?[^\s,]+(\s+uur)?\s+(ik|u|hij|zij|ze|we|wij)\b/i

function tokens(text: string): string[] {
  return text
    .replace(/[.?!,:;]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

/**
 * Local checks for one answer to an open question on a form. A `fail` blocks
 * the form; a `warn` is a pointer the owner judges, since the checker only
 * knows the glossary's words.
 */
export function checkAnswer(question: OpenQuestion, text: string): CheckResult[] {
  const trimmed = text.trim()
  const words = tokens(trimmed)
  const results: CheckResult[] = []

  const sentenceShape = /^[A-ZÀ-Þ]/.test(trimmed) && /[.?!]$/.test(trimmed)
  results.push({
    id: 'zin',
    label: 'Capital and full stop',
    status: sentenceShape ? 'ok' : 'fail',
    detail: sentenceShape
      ? 'Your answer starts with a capital letter and ends with a full stop.'
      : 'Start your answer with a capital letter and end it with a full stop.',
  })

  results.push({
    id: 'lengte',
    label: 'Whole sentence',
    status: words.length >= MIN_WORDS ? 'ok' : 'fail',
    detail:
      words.length >= MIN_WORDS
        ? `${words.length} words.`
        : `Answer in a whole sentence of at least ${MIN_WORDS} words, like "Ik kom op zaterdag." One word shows the examiner very little of your Dutch.`,
  })

  const answered = question.keywords.some((kw) => new RegExp(`\\b${kw}`, 'i').test(trimmed))
  results.push({
    id: 'antwoord',
    label: 'Answers the question',
    status: answered ? 'ok' : 'fail',
    detail: answered
      ? 'There is a word in your answer that fits the question. This is only a word check: read it back to see that it really answers it.'
      : `I cannot find ${question.expects} in your answer. Read the question again: what does it ask for?`,
  })

  const verb = words.find((word) => lookupWord(word)?.verb)
  results.push({
    id: 'werkwoord',
    label: 'Verb',
    status: verb ? 'ok' : 'warn',
    detail: verb
      ? `Your sentence has a verb: "${verb}".`
      : 'I cannot find a verb. A whole sentence needs one: "Ik kom", "Het is". I only know common verbs, so check yourself.',
  })

  const informal = trimmed.match(INFORMAL) ?? []
  results.push({
    id: 'register',
    label: 'Formal',
    status: informal.length === 0 ? 'ok' : 'fail',
    detail:
      informal.length === 0
        ? 'No informal words: right for a form.'
        : `A form is formal, but I see ${[...new Set(informal.map((w) => w.toLowerCase()))].join(', ')}. Use u and uw.`,
  })

  const dt = [...(trimmed.match(DT_MISSING) ?? []), ...(trimmed.match(DT_EXTRA) ?? [])]
  if (dt.length > 0) {
    results.push({
      id: 'dt',
      label: '-d / -dt',
      status: 'fail',
      detail: `Look at ${dt.map((p) => `"${p.trim()}"`).join(', ')} again. With hij, zij and u the stem gets a -t; with ik it does not.`,
    })
  }

  const inversionMiss = trimmed
    .split(/[.!?]\s+/)
    .map((s) => s.trim())
    .find((s) => {
      if (FRONTED_PHRASE.test(s)) return true
      const match = FRONTED.exec(s)
      return match !== null && SUBJECT_PRONOUNS.test(s.slice(match[0].length).trim())
    })
  if (inversionMiss) {
    results.push({
      id: 'inversie',
      label: 'Inversion',
      status: 'warn',
      detail: `When a time or place starts the sentence, the verb comes before the subject: "Op dinsdag kan ik", not "Op dinsdag ik kan". Look at "${inversionMiss.slice(0, 40)}".`,
    })
  }

  // After omdat, and dat in the middle of a sentence, the finite verb goes last.
  const clause = /(?:\bomdat|[a-zà-ÿ]\s+dat)\s+([^.,;!?]+)/i.exec(trimmed)
  if (clause) {
    const last = tokens(clause[1]).at(-1) ?? ''
    const entry = lookupWord(last)
    results.push({
      id: 'bijzin',
      label: 'Verb at the end',
      status: entry?.verb ? 'ok' : 'warn',
      detail: entry?.verb
        ? `After omdat or dat your verb is last: "${last}".`
        : `After omdat or dat the finite verb goes to the end of that part of the sentence. Yours ends in "${last}": is that a verb?`,
    })
  }

  return results
}

/** True when nothing failed: warnings are left to the owner. */
export function answerPasses(results: CheckResult[]): boolean {
  return results.every((r) => r.status !== 'fail')
}
