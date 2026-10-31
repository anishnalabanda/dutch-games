import { MISTAKE_LABEL, type Mistake, type MistakeType } from '../games/schrijven/taken/mistakes'
import { askJson } from './claude'

/**
 * Claude reading the mistakes of every finished writing task together, to
 * find the habits behind them. It gets the saved mistakes, not the texts:
 * the texts are not all kept, and the mistakes are enough to see a pattern.
 */

export interface GameMistakes {
  /** English, e.g. "Formal e-mail". */
  game: string
  /** Dutch task title to that task's latest mistakes. */
  tasks: { title: string; mistakes: Mistake[] }[]
}

export interface Coaching {
  /** English, one sentence. */
  summary: string
  habits: Habit[]
  /** English, one sentence. */
  strength: string
}

export interface Habit {
  type: MistakeType
  /** English, a few words. */
  title: string
  /** Dutch, taken from the learner's own mistakes. */
  examples: { original: string; corrected: string }[]
  /** English, one plain sentence. */
  rule: string
  /** Dutch: sentences with this mistake in them, to rewrite. */
  practice: { wrong: string; right: string }[]
}

const SYSTEM = `You coach an adult English speaker for the Dutch DUO inburgering A2 Schrijven (writing) exam, which is handwritten. You are given the mistakes an examiner would mark in the learner's practice tasks. Find the habits: mistakes of the same kind that keep coming back, not one-off slips. Judge at A2. Write every explanation in short, plain English with no grammar terms; if one is unavoidable, explain it in brackets. Dutch appears only in examples and practice sentences, at A2 level. Never use the em dash character.`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['summary', 'habits', 'strength'],
  properties: {
    summary: { type: 'string', description: 'English, one short sentence: the overall picture.' },
    habits: {
      type: 'array',
      description: 'The habits most worth fixing before the exam, most important first, at most three. Only kinds of mistake that came up in two or more tasks; empty if there are none.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['type', 'title', 'examples', 'rule', 'practice'],
        properties: {
          type: { type: 'string', enum: Object.keys(MISTAKE_LABEL) },
          title: { type: 'string', description: 'English, three to eight words naming the habit, e.g. "Verb 3rd after a time word".' },
          examples: {
            type: 'array',
            description: "One or two of the learner's own mistakes of this kind, quoted exactly as given. Empty if none were quoted.",
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['original', 'corrected'],
              properties: { original: { type: 'string' }, corrected: { type: 'string' } },
            },
          },
          rule: { type: 'string', description: 'English, one short plain sentence: what to do instead.' },
          practice: {
            type: 'array',
            description: 'Exactly three new short Dutch sentences that each have this mistake, from situations in the A2 writing exam (work, the doctor, neighbours, school, appointments), with the corrected sentence.',
            items: {
              type: 'object',
              additionalProperties: false,
              required: ['wrong', 'right'],
              properties: { wrong: { type: 'string' }, right: { type: 'string' } },
            },
          },
        },
      },
    },
    strength: { type: 'string', description: 'English, one short sentence: something the learner already does well, honestly.' },
  },
} as const

function describe(games: GameMistakes[]): string {
  const lines: string[] = []
  for (const game of games) {
    lines.push(`## ${game.game}`)
    for (const task of game.tasks) {
      if (task.mistakes.length === 0) {
        lines.push(`- ${task.title}: no mistakes`)
        continue
      }
      lines.push(`- ${task.title}:`)
      for (const m of task.mistakes) {
        const quote = m.original ? ` "${m.original}" -> "${m.corrected ?? ''}"` : ''
        lines.push(`  - ${m.type}${quote}${m.explain ? ` (${m.explain})` : ''}`)
      }
    }
    lines.push('')
  }
  return lines.join('\n')
}

export function claudeCoaching(key: string, games: GameMistakes[]): Promise<Coaching> {
  return askJson<Coaching>({
    key,
    system: SYSTEM,
    effort: 'medium',
    schema: SCHEMA,
    prompt: `The learner's finished writing tasks, per game, with the mistakes of their latest attempt. The form game keeps only the kind of each mistake, never the words. Mistake kinds: ${Object.entries(
      MISTAKE_LABEL,
    )
      .map(([k, v]) => `${k} = ${v}`)
      .join('; ')}.

${describe(games)}
What are this learner's habits, and how do they fix them?`,
  })
}
