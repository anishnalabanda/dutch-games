import { lookupWord } from '../../glossary'
import type { StemRule, WritingTask } from './data'

export type CheckStatus = 'ok' | 'warn' | 'fail'

export interface CheckResult {
  id: string
  label: string
  status: CheckStatus
  detail: string
}

const OPENINGS = /^(geachte|beste|hoi|hallo|lieve|dag)\b/i
const CLOSINGS = /(met vriendelijke groet|vriendelijke groet|hartelijke groet|met groet|groeten|groetjes|hoogachtend)/i
const INFORMAL = /\b(je|jij|jou|jouw|jullie|joh)\b/gi
const FORMAL = /\b(u|uw)\b/gi

/** Finite verb forms common enough at A2 to check word order against. */
const FRONTED = /^(morgen|vandaag|gisteren|overmorgen|vanavond|vanmiddag|vanmorgen|daarna|daarom|hierbij|volgende week|vorige week|nu|straks|misschien|helaas)\b/i
const SUBJECT_PRONOUNS = /^(ik|je|jij|u|hij|zij|ze|het|we|wij|jullie)\b/i

const DT_MISSING = /\b(hij|zij|ze|het|je|jij|u|mijn \w+)\s+(word|vind|houd|antwoord|beslis)\b/gi
const DT_EXTRA = /\bik\s+(wordt|vindt|houdt|antwoordt)\b/gi

function sentences(text: string): string[] {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

function words(text: string): string[] {
  return text.split(/\s+/).filter(Boolean)
}

/**
 * Local, mechanical checks only. They cannot judge whether the message is
 * actually good Dutch: see the honesty note shown alongside the results.
 */
export function runChecks(task: WritingTask, text: string): CheckResult[] {
  const results: CheckResult[] = []
  const trimmed = text.trim()
  const lines = trimmed.split('\n').map((l) => l.trim()).filter(Boolean)
  const sents = sentences(trimmed)
  const wordCount = words(trimmed).length

  // 1. Required points: a keyword scan, nothing more.
  const missing = task.points.filter(
    (point) => !point.keywords.some((kw) => new RegExp(`\\b${kw}`, 'i').test(trimmed)),
  )
  results.push({
    id: 'punten',
    label: 'Points from the brief',
    status: missing.length === 0 ? 'ok' : 'fail',
    detail:
      missing.length === 0
        ? `For all ${task.points.length} points there is a matching word in your text. This is only a word check: read it back yourself to see whether you really cover the point.`
        : `I found no words for these: ${missing.map((p) => `"${p.label}"`).join(', ')}.`,
  })

  // 2. Length.
  results.push({
    id: 'lengte',
    label: 'Length',
    status: sents.length >= task.minSentences ? 'ok' : 'warn',
    detail: `${sents.length} ${sents.length === 1 ? 'sentence' : 'sentences'}, ${wordCount} words. For this task at least ${task.minSentences} sentences is a good size.`,
  })

  // 3. Opening.
  const hasOpening = lines.length > 0 && OPENINGS.test(lines[0])
  results.push({
    id: 'aanhef',
    label: 'Opening',
    status: hasOpening ? 'ok' : 'fail',
    detail: hasOpening
      ? `You start with "${lines[0]}".`
      : 'I cannot find an opening on the first line. Start with Geachte heer/mevrouw, Beste ... or Hoi ...',
  })

  // 4. Closing.
  const hasClosing = CLOSINGS.test(trimmed)
  results.push({
    id: 'afsluiting',
    label: 'Closing',
    status: hasClosing ? 'ok' : 'fail',
    detail: hasClosing
      ? 'There is a closing under your message.'
      : 'I cannot find a closing. Put "Met vriendelijke groet" or "Groetjes" underneath, with your name.',
  })

  // 5. Register, and consistency within the message.
  const informalHits = trimmed.match(INFORMAL) ?? []
  const formalHits = trimmed.match(FORMAL) ?? []
  if (task.register === 'formeel') {
    results.push({
      id: 'register',
      label: 'Register (u)',
      status: informalHits.length === 0 ? 'ok' : 'fail',
      detail:
        informalHits.length === 0
          ? 'No informal words found, which fits this recipient.'
          : `This task is formal, but I see an informal word ${informalHits.length}x: ${[...new Set(informalHits.map((h) => h.toLowerCase()))].join(', ')}. Use u and uw.`,
    })
  } else {
    results.push({
      id: 'register',
      label: 'Register (je)',
      status: formalHits.length === 0 ? 'ok' : 'fail',
      detail:
        formalHits.length === 0
          ? 'No formal words found, which fits this recipient.'
          : `This task is informal, but I see "u" or "uw" ${formalHits.length}x. Use je, jij and jouw.`,
    })
  }

  // 6. The -dt slips.
  const dtMissing = trimmed.match(DT_MISSING) ?? []
  const dtExtra = trimmed.match(DT_EXTRA) ?? []
  const dtProblems = [...dtMissing, ...dtExtra]
  results.push({
    id: 'dt',
    label: '-d / -dt',
    status: dtProblems.length === 0 ? 'ok' : 'fail',
    detail:
      dtProblems.length === 0
        ? 'No known -dt mistakes found. Careful: I only know the most common ones.'
        : `Have another look at these: ${dtProblems.map((p) => `"${p.trim()}"`).join(', ')}. With hij/zij/u a -t is added to the stem; with ik it is not.`,
  })

  // 7. Capitals after a full stop.
  const lowercaseStarts = sents.filter((s) => /^[a-z]/.test(s))
  results.push({
    id: 'hoofdletters',
    label: 'Capital letters',
    status: lowercaseStarts.length === 0 ? 'ok' : 'warn',
    detail:
      lowercaseStarts.length === 0
        ? 'Every sentence starts with a capital letter.'
        : `${lowercaseStarts.length} ${lowercaseStarts.length === 1 ? 'sentence starts' : 'sentences start'} with a lower-case letter, for example "${lowercaseStarts[0].slice(0, 30)}...".`,
  })

  // 8. Inversion after a fronted time word: only flagged when the very next
  //    word is a subject pronoun, which is the classic mistake.
  const inversionMisses = sents.filter((s) => {
    const match = FRONTED.exec(s)
    if (!match) return false
    const rest = s.slice(match[0].length).trim()
    return SUBJECT_PRONOUNS.test(rest)
  })
  results.push({
    id: 'inversie',
    label: 'Inversion',
    status: inversionMisses.length === 0 ? 'ok' : 'warn',
    detail:
      inversionMisses.length === 0
        ? 'No sentences found where the inversion is missing.'
        : `When a sentence starts with a time word, the verb comes first and the subject after it: "Morgen bel ik u", not "Morgen ik bel u". Look at: "${inversionMisses[0].slice(0, 40)}...".`,
  })

  return results
}

export const PAPER_NOTE =
  'The real A2 writing exam is handwritten on paper: 40 minutes for four tasks. So practise with pen and paper where you can. The app gives you the task and the clock, and then the model answer and the criteria to mark your own sheet against.'

export const HONESTY_NOTE =
  'This app runs without a server and without a language model, so these are mechanical checks. They see whether words are there, not whether your Dutch is right. A green tick is not a grade. Compare your text with the model, then walk the checklist yourself: that is the real marking here.'

// --- Level 1: finishing sentences --------------------------------------------

/**
 * Checks a sentence completion against the one rule its stem is drilling. It
 * leans on the glossary's verb flags, so it only recognises A2 verbs: an
 * unknown word is reported as "couldn't tell", never as wrong.
 */
export function checkCompletion(rule: StemRule, text: string): CheckResult[] {
  const trimmed = text.trim()
  const tokens = trimmed.replace(/[.?!,]/g, '').split(/\s+/).filter(Boolean)
  const results: CheckResult[] = []

  if (tokens.length === 0) return results

  const firstEntry = lookupWord(tokens[0])
  const lastEntry = lookupWord(tokens[tokens.length - 1])

  if (rule === 'bijzin') {
    const known = lastEntry !== null
    results.push({
      id: 'werkwoord-eind',
      label: 'Verb at the end',
      status: !known ? 'warn' : lastEntry.verb ? 'ok' : 'fail',
      detail: !known
        ? `I do not know "${tokens[tokens.length - 1]}", so I cannot tell whether it is a verb. Check yourself that the finite verb is last.`
        : lastEntry.verb
          ? `Good: your sentence ends in "${tokens[tokens.length - 1]}".`
          : `Your sentence ends in "${tokens[tokens.length - 1]}", which is not a verb. After omdat, dat, of and als the finite verb goes last.`,
    })
  }

  if (rule === 'inversie') {
    const known = firstEntry !== null
    results.push({
      id: 'inversie-start',
      label: 'Verb at the front',
      status: !known ? 'warn' : firstEntry.verb ? 'ok' : 'fail',
      detail: !known
        ? `I do not know "${tokens[0]}", so I cannot tell whether it is a verb. Check yourself that the finite verb comes before the subject.`
        : firstEntry.verb
          ? `Good: you start with "${tokens[0]}".`
          : `You start with "${tokens[0]}". After a phrase at the front the finite verb comes first: "Morgen bel ik u".`,
    })
  }

  if (rule === 'hoofdzin') {
    // "Plaats 2" counts constituents, not words: "Mijn dochter heeft koorts" is
    // right even though the verb is the third word. So look for a finite verb
    // anywhere near the front and only flag when there is none at all.
    const opening = tokens.slice(0, 4)
    const verbAt = opening.findIndex((token) => lookupWord(token)?.verb)
    results.push({
      id: 'tweede-plaats',
      label: 'Finite verb near the front',
      status: verbAt === -1 ? 'warn' : 'ok',
      detail:
        verbAt === -1
          ? 'I cannot find a verb near the front. After want the finite verb sits right behind the subject: "want ik ben ziek". I only recognise common verbs, so check for yourself too.'
          : `Good: "${opening[verbAt]}" is near the front, right behind the subject.`,
    })
  }

  results.push({
    id: 'leesteken',
    label: 'Punctuation',
    status: /[.?!]$/.test(trimmed) ? 'ok' : 'warn',
    detail: /[.?!]$/.test(trimmed)
      ? 'Your sentence ends with a punctuation mark.'
      : 'Put a full stop (or a question mark) at the end of the sentence.',
  })

  return results
}
