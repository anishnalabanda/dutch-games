import { lookupWord } from '../../glossary'
import type { Issue, Point, Register, TextTask } from './types'

/**
 * Pattern checks for a written exam task. There is no server and no language
 * model on GitHub Pages, so this looks for words and shapes, never meaning:
 * it says what it cannot find, and the owner can tick a point off by hand.
 *
 * Issues come back in the order the hint button walks them: first the points
 * from the brief, then register, length and sentence shape (all blocking), then
 * grammar advice, which never blocks.
 */

export const HONESTY_NOTE =
  'These are pattern checks: they look for typical words and sentence shapes, not for meaning. If you covered a point in your own words, tick it off yourself.'

export const PAPER_NOTE =
  'On the exam you write this by hand, with no spellcheck. Try it once more on paper: same points, same greeting.'

const INFORMAL = /\b(je|jij|jou|jouw|jullie)\b/gi
const FORMAL = /\b(u|uw)\b/gi
const FIRST_PERSON = /\b(ik|mijn|me|mij|we|wij|ons|onze)\b/i
const SUBJECTS = /^(ik|je|jij|u|hij|zij|ze|het|we|wij|jullie|er)$/i
const DETERMINERS = /^(mijn|jouw|uw|zijn|haar|onze|ons|de|het|een)$/i

/** A time word at the front: the verb has to come straight after it. */
const FRONTED =
  /^(morgen|vandaag|gisteren|overmorgen|vanavond|vanmiddag|vanochtend|vanmorgen|daarna|daarom|dan|nu|straks|misschien|helaas|eerst|soms|vaak|meestal|altijd|volgende week|vorige week|vorig jaar|volgend jaar|elk jaar|elke dag|elke week)\s+(ik|je|jij|u|hij|zij|ze|we|wij)\b/i

/** A phrase at the front ("In het weekend", "Om 9.00 uur"), then the subject. */
const FRONTED_PHRASE = new RegExp(
  '^(op|in|om|na|sinds|elke|elk|tijdens|met)\\s+((de|het|een|mijn)\\s+)?[^\\s,]+' +
    '(\\s+\\d+)?(\\s+(januari|februari|maart|april|mei|juni|juli|augustus|september|oktober|november|december))?' +
    '(\\s+uur)?\\s+(ik|je|jij|u|hij|zij|ze|we|wij)\\b',
  'i',
)

const DT_MISSING = /\b(hij|zij|ze|het|jij|u)\s+(word|vind|houd|antwoord|beslis)\b/gi
const DT_EXTRA = /\b(ik\s+(wordt|vindt|houdt|antwoordt)|(wordt|vindt|houdt|antwoordt)\s+(ik|jij))\b/gi

/** The printed greeting or closing, written a second time. */
const GREETING = /^(beste|hallo|hoi|geachte|lieve|dag)\b/i
const CLOSING = /\b(vriendelijke groet|met groet|groetjes|groeten)\b/i
/** A line copied from the instructions instead of answered. */
const INSTRUCTION = /^(schrijf|bedenk|bied|denk aan|vertel wat|dit is mijn tekst)\b/i

export function hasKeyword(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => new RegExp(`\\b${kw}`, 'i').test(text))
}

/** Sentences, and every line on its own: a line without a full stop is a sentence without one. */
export function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

export function wordsOf(text: string): string[] {
  return text
    .replace(/[.,!?;:()"“”]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function isVerb(word: string | undefined): boolean {
  return word !== undefined && lookupWord(word)?.verb === true
}

function quote(text: string, max = 40): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}

function unique(hits: string[]): string {
  return [...new Set(hits.map((h) => h.toLowerCase()))].map((h) => `"${h}"`).join(', ')
}

export function missingPoint(point: Point): Issue {
  return {
    id: `punt-${point.id}`,
    blocking: true,
    title: `Not found yet: ${point.label}`,
    explain:
      'Write one whole sentence for this point. I look for typical words, so if you did cover it in your own words, tick "I covered this" next to it.',
    starter: point.starter,
    example: point.example,
  }
}

/**
 * Whole-sentence shape: a capital at the start, a full stop (or ? or !) at the
 * end. `prefix` keeps issue ids apart when a form checks several answers.
 */
export function shapeIssues(text: string, prefix = '', target?: string): Issue[] {
  const issues: Issue[] = []
  const units = sentencesOf(text)
  const noStop = units.find((s) => !/[.!?]$/.test(s))
  if (noStop) {
    issues.push({
      id: `${prefix}punt`,
      blocking: true,
      title: 'A full stop is missing',
      explain: `End every sentence with a full stop, or a question mark for a question. Look at: "${quote(noStop)}".`,
      target,
    })
  }
  const lower = units.find((s) => /^[a-zà-ÿ]/.test(s))
  if (lower) {
    issues.push({
      id: `${prefix}hoofdletter`,
      blocking: true,
      title: 'A sentence starts with a small letter',
      explain: `Start every sentence with a capital letter. Look at: "${quote(lower)}".`,
      target,
    })
  }
  return issues
}

/**
 * Grammar advice, the slips examiners mark down most: inversion, the verb
 * after omdat and after want, and -d/-dt. Only flagged where the pattern is
 * clear, since a false alarm here would teach the wrong thing.
 */
export function grammarAdvice(text: string, prefix = '', target?: string): Issue[] {
  const issues: Issue[] = []
  const units = sentencesOf(text)

  const inversion = units.find((s) => FRONTED.test(s) || FRONTED_PHRASE.test(s))
  if (inversion) {
    issues.push({
      id: `${prefix}inversie`,
      blocking: false,
      title: 'Verb after a time or place at the front',
      explain: `When a sentence starts with a time or a place, the verb comes next and the subject after it. Look at: "${quote(inversion)}".`,
      starter: 'In het weekend wandel ik …',
      example: 'Morgen kan ik niet komen.',
      target,
    })
  }

  for (const match of text.matchAll(/\bomdat\s+([^.,;!?]+)/gi)) {
    const t = wordsOf(match[1])
    const last = t.at(-1)
    const pronounThenVerb = SUBJECTS.test(t[0] ?? '') && isVerb(t[1])
    const nounThenVerb = DETERMINERS.test(t[0] ?? '') && !isVerb(t[1]) && isVerb(t[2])
    if ((pronounThenVerb && t.length >= 3) || (nounThenVerb && t.length >= 4)) {
      if (!isVerb(last)) {
        issues.push({
          id: `${prefix}omdat`,
          blocking: false,
          title: 'Verb at the end after omdat',
          explain: `After omdat the verb moves to the end of that part of the sentence. Look at: "omdat ${quote(match[1].trim())}".`,
          starter: '… omdat ik ziek ben.',
          example: 'Ik kan niet komen, omdat ik een afspraak bij de dokter heb.',
          target,
        })
        break
      }
    }
  }

  for (const match of text.matchAll(/\bwant\s+([^.;!?]+)/gi)) {
    const t = wordsOf(match[1])
    if (t.length >= 3 && isVerb(t.at(-1)) && !t.slice(0, -1).some((w) => isVerb(w))) {
      issues.push({
        id: `${prefix}want`,
        blocking: false,
        title: 'Normal word order after want',
        explain: `After want the order stays normal: subject, then verb. Only omdat sends the verb to the end. Look at: "want ${quote(match[1].trim())}".`,
        starter: '… want ik ben ziek.',
        example: 'Ik kan niet komen, want ik ben ziek.',
        target,
      })
      break
    }
  }

  const dt = [...(text.match(DT_MISSING) ?? []), ...(text.match(DT_EXTRA) ?? [])]
  if (dt.length > 0) {
    issues.push({
      id: `${prefix}dt`,
      blocking: false,
      title: '-d or -dt',
      explain: `Look again at ${unique(dt)}. With hij, zij, het and u the verb gets a -t (hij wordt, u vindt). With ik it does not, and neither when jij comes after the verb (vind jij).`,
      target,
    })
  }

  return issues
}

interface TextInput {
  task: TextTask
  body: string
  /** The name written under the closing, for an e-mail or a note. */
  name: string
  /** Points the owner ticked off by hand. */
  covered: Set<string>
}

/** Every issue with a text task, in the order the hint button walks them. */
export function textIssues({ task, body, name, covered }: TextInput): Issue[] {
  const text = body.trim()
  const first = task.points[0]

  if (text === '') {
    return [
      {
        id: 'leeg',
        blocking: true,
        title: 'Nothing written yet',
        explain: `Start with the first point: ${first.label.toLowerCase()}. One whole sentence per point is enough.`,
        starter: first.starter,
        example: first.example,
      },
    ]
  }

  const issues: Issue[] = []

  for (const point of task.points) {
    if (!covered.has(point.id) && !hasKeyword(text, point.keywords)) issues.push(missingPoint(point))
  }

  issues.push(...registerIssues(task.register, text))

  const count = sentencesOf(text).filter((s) => wordsOf(s).length >= 2).length
  if (count < task.minSentences) {
    issues.push({
      id: 'aantal',
      blocking: true,
      title: `Write at least ${task.minSentences} sentences`,
      explain: `You have ${count}. Give every point its own whole sentence, with a subject and a verb.`,
    })
  }

  issues.push(...shapeIssues(text))

  if (task.frame.kind !== 'krant' && !/^[A-ZÀ-Þ]/.test(name.trim())) {
    issues.push({
      id: 'naam',
      blocking: true,
      title: 'Your name under the closing',
      explain:
        name.trim() === ''
          ? 'Write your name on the line under the closing, as you would sign it on paper.'
          : 'Start your name with a capital letter.',
    })
  }

  issues.push(...layoutAdvice(task, text))
  issues.push(...grammarAdvice(text))
  return issues
}

function registerIssues(register: Register, text: string): Issue[] {
  if (register === 'u') {
    const hits = text.match(INFORMAL) ?? []
    if (hits.length === 0) return []
    return [
      {
        id: 'register',
        blocking: true,
        title: 'Use u, not je',
        explain: `The printed greeting uses meneer or mevrouw with a surname, so write u and uw throughout. I see ${unique(hits)}.`,
        example: 'Kunt u mij laten weten of dat kan?',
      },
    ]
  }

  if (register === 'je') {
    const hits = text.match(FORMAL) ?? []
    if (hits.length === 0) return []
    return [
      {
        id: 'register',
        blocking: true,
        title: 'Use je, not u',
        explain: `The printed greeting uses a first name, so write je, jij and jouw. I see ${unique(hits)}. The brief says u because it talks to you, the candidate; your message is to a friend or colleague.`,
        example: 'Kun jij mij helpen?',
      },
    ]
  }

  const issues: Issue[] = []
  if (!FIRST_PERSON.test(text)) {
    issues.push({
      id: 'ik-vorm',
      blocking: true,
      title: 'Write about yourself',
      explain: 'This is your own text for the neighbourhood paper, so write with ik and mijn.',
      example: 'In het weekend wandel ik graag.',
    })
  }
  const hits = text.match(FORMAL) ?? []
  if (hits.length > 0) {
    issues.push({
      id: 'register',
      blocking: false,
      title: 'u from the questions',
      explain: `I see ${unique(hits)}. The questions say u because they talk to you; in your answer that becomes ik: "Wat doet u graag?" becomes "Ik … graag."`,
    })
  }
  return issues
}

/** The printed greeting, closing or lead written again, or an instruction copied. */
function layoutAdvice(task: TextTask, text: string): Issue[] {
  const issues: Issue[] = []
  const units = sentencesOf(text)
  if (task.frame.kind !== 'krant') {
    if (GREETING.test(units[0] ?? '')) {
      issues.push({
        id: 'aanhef',
        blocking: false,
        title: 'The greeting is already printed',
        explain: 'The exam prints the greeting above your space. Start straight away with your first sentence.',
      })
    }
    if (CLOSING.test(text)) {
      issues.push({
        id: 'groet',
        blocking: false,
        title: 'The closing is already printed',
        explain: 'The exam prints the closing under your space. Only your name goes there.',
      })
    }
  }
  const copied = units.find((s) => INSTRUCTION.test(s))
  if (copied) {
    issues.push({
      id: 'opdracht',
      blocking: false,
      title: 'Copied from the task',
      explain: `"${quote(copied)}" looks like a line from the task itself. Answer it instead: turn "Schrijf dat u …" into "Ik …".`,
    })
  }
  return issues
}
