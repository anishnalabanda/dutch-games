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
    label: 'Punten uit de opdracht',
    status: missing.length === 0 ? 'ok' : 'fail',
    detail:
      missing.length === 0
        ? `Van alle ${task.points.length} punten staat er een woord in je tekst. Dit is alleen een woordcheck: lees zelf na of je het punt ook echt uitlegt.`
        : `Hier vond ik geen woorden van: ${missing.map((p) => `"${p.label}"`).join(', ')}.`,
  })

  // 2. Length.
  results.push({
    id: 'lengte',
    label: 'Lengte',
    status: sents.length >= task.minSentences ? 'ok' : 'warn',
    detail: `${sents.length} ${sents.length === 1 ? 'zin' : 'zinnen'}, ${wordCount} woorden. Voor deze opdracht zijn minstens ${task.minSentences} zinnen een goede maat.`,
  })

  // 3. Opening.
  const hasOpening = lines.length > 0 && OPENINGS.test(lines[0])
  results.push({
    id: 'aanhef',
    label: 'Aanhef',
    status: hasOpening ? 'ok' : 'fail',
    detail: hasOpening
      ? `Je begint met "${lines[0]}".`
      : 'Ik vind geen aanhef op de eerste regel. Begin met Geachte heer/mevrouw, Beste ... of Hoi ...',
  })

  // 4. Closing.
  const hasClosing = CLOSINGS.test(trimmed)
  results.push({
    id: 'afsluiting',
    label: 'Afsluiting',
    status: hasClosing ? 'ok' : 'fail',
    detail: hasClosing
      ? 'Er staat een afsluiting onder je bericht.'
      : 'Ik vind geen afsluiting. Zet er "Met vriendelijke groet" of "Groetjes" onder, met je naam.',
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
          ? 'Geen informele woorden gevonden, dat past bij deze ontvanger.'
          : `Deze opdracht is formeel, maar ik zie ${informalHits.length}x een informeel woord: ${[...new Set(informalHits.map((h) => h.toLowerCase()))].join(', ')}. Gebruik u en uw.`,
    })
  } else {
    results.push({
      id: 'register',
      label: 'Register (je)',
      status: formalHits.length === 0 ? 'ok' : 'fail',
      detail:
        formalHits.length === 0
          ? 'Geen formele woorden gevonden, dat past bij deze ontvanger.'
          : `Deze opdracht is informeel, maar ik zie ${formalHits.length}x "u" of "uw". Gebruik je, jij en jouw.`,
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
        ? 'Geen bekende -dt-fouten gevonden. Let op: ik ken alleen de meest voorkomende.'
        : `Kijk hier nog eens naar: ${dtProblems.map((p) => `"${p.trim()}"`).join(', ')}. Bij hij/zij/u komt er -t bij de stam; bij ik niet.`,
  })

  // 7. Capitals after a full stop.
  const lowercaseStarts = sents.filter((s) => /^[a-z]/.test(s))
  results.push({
    id: 'hoofdletters',
    label: 'Hoofdletters',
    status: lowercaseStarts.length === 0 ? 'ok' : 'warn',
    detail:
      lowercaseStarts.length === 0
        ? 'Elke zin begint met een hoofdletter.'
        : `${lowercaseStarts.length} ${lowercaseStarts.length === 1 ? 'zin begint' : 'zinnen beginnen'} met een kleine letter, bijvoorbeeld "${lowercaseStarts[0].slice(0, 30)}...".`,
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
    label: 'Inversie',
    status: inversionMisses.length === 0 ? 'ok' : 'warn',
    detail:
      inversionMisses.length === 0
        ? 'Geen zinnen gevonden waar de inversie ontbreekt.'
        : `Begint een zin met een tijdwoord, dan komt eerst het werkwoord en daarna pas het onderwerp: "Morgen bel ik u", niet "Morgen ik bel u". Kijk naar: "${inversionMisses[0].slice(0, 40)}...".`,
  })

  return results
}

export const PAPER_NOTE =
  'Het echte A2-examen Schrijven doe je met de hand op papier, in 40 minuten voor vier opdrachten. Oefen daarom bij voorkeur met pen en papier: de app geeft je de opdracht en de klok, en daarna het modelantwoord en de criteria om je eigen blad mee na te kijken.'

export const HONESTY_NOTE =
  'Deze app draait zonder server en zonder taalmodel: dit zijn mechanische checks. Ze zien of er wóórden staan, niet of je Nederlands klopt. Een groen vinkje is dus geen cijfer. Vergelijk je tekst met het model en loop daarna de checklist zelf na, dat is hier het echte nakijkwerk.'

// --- Level 1: zinnen afmaken -------------------------------------------------

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
      label: 'Werkwoord aan het eind',
      status: !known ? 'warn' : lastEntry.verb ? 'ok' : 'fail',
      detail: !known
        ? `Ik ken "${tokens[tokens.length - 1]}" niet, dus ik kan niet zien of het een werkwoord is. Controleer zelf of de persoonsvorm achteraan staat.`
        : lastEntry.verb
          ? `Goed: je zin eindigt op "${tokens[tokens.length - 1]}".`
          : `Je zin eindigt op "${tokens[tokens.length - 1]}", en dat is geen werkwoord. Na omdat, dat, of en als hoort de persoonsvorm achteraan.`,
    })
  }

  if (rule === 'inversie') {
    const known = firstEntry !== null
    results.push({
      id: 'inversie-start',
      label: 'Werkwoord vooraan',
      status: !known ? 'warn' : firstEntry.verb ? 'ok' : 'fail',
      detail: !known
        ? `Ik ken "${tokens[0]}" niet, dus ik kan niet zien of het een werkwoord is. Controleer zelf of de persoonsvorm vóór het onderwerp staat.`
        : firstEntry.verb
          ? `Goed: je begint met "${tokens[0]}".`
          : `Je begint met "${tokens[0]}". Na een bepaling vooraan komt eerst de persoonsvorm: "Morgen bel ik u".`,
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
      label: 'Persoonsvorm vooraan',
      status: verbAt === -1 ? 'warn' : 'ok',
      detail:
        verbAt === -1
          ? 'Ik vind vooraan geen werkwoord. Na want staat de persoonsvorm vlak achter het onderwerp: "want ik ben ziek". Ik herken alleen veelgebruikte werkwoorden, dus kijk zelf ook.'
          : `Goed: "${opening[verbAt]}" staat vooraan, vlak achter het onderwerp.`,
    })
  }

  results.push({
    id: 'leesteken',
    label: 'Leesteken',
    status: /[.?!]$/.test(trimmed) ? 'ok' : 'warn',
    detail: /[.?!]$/.test(trimmed)
      ? 'Je zin eindigt met een leesteken.'
      : 'Zet een punt (of vraagteken) aan het eind van de zin.',
  })

  return results
}
