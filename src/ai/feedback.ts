import type { Issue, TextTask } from '../games/schrijven/taken/types'
import type { FormTask } from '../games/schrijven/formulieren/data'
import { askJson } from './claude'

/**
 * What Claude is asked about an exam writing task, and the shape of what it
 * answers. Two requests: a hint (the one next step, while writing) and a
 * review (the whole text, on Submit). Both get the task exactly as the exam
 * page prints it, plus what the pattern checks already found.
 */

/** The task as the exam prints it, reduced to what an examiner needs. */
export interface WritingContext {
  kind: 'e-mail' | 'note' | 'neighbourhood paper text' | 'form'
  /** Dutch. */
  title: string
  situation: string
  pictures: string[]
  bullets: string[]
  instructions: string[]
  /** Who the text is written to, which decides u or je. */
  register: string
  greeting?: string
  closing?: string
  minSentences?: number
  /** What the examiner checks for: the brief's points, or a form's questions. */
  points: { id: string; label: string }[]
  /** What the candidate wrote. A text task has one part; a form has one per question. */
  parts: { id: string; label: string; text: string }[]
}

const REGISTER: Record<TextTask['register'], string> = {
  u: 'formal: the printed greeting uses meneer/mevrouw and a surname, so the text must say u and uw throughout',
  je: 'informal: the printed greeting uses a first name, so the text must say je, jij and jouw (the brief says u only because it addresses the candidate)',
  ik: 'a text about yourself: written with ik and mijn; the questions say u only because they address the candidate',
}

export function textContext(task: TextTask, body: string): WritingContext {
  const frame = task.frame
  return {
    kind: frame.kind === 'mail' ? 'e-mail' : frame.kind === 'note' ? 'note' : 'neighbourhood paper text',
    title: task.title,
    situation: task.situation,
    pictures: (task.pictures ?? []).map((p) => p.shows),
    bullets: task.intro ? [task.intro, ...task.bullets] : task.bullets,
    instructions: task.instructions,
    register: REGISTER[task.register],
    greeting: frame.kind === 'krant' ? frame.lead : frame.greeting,
    closing: frame.kind === 'mail' ? frame.closing : frame.kind === 'note' ? frame.closing.join(' / ') : undefined,
    minSentences: task.minSentences,
    points: task.points.map((p) => ({ id: p.id, label: p.label })),
    parts: [{ id: 'body', label: 'The text between the printed greeting and closing', text: body }],
  }
}

/**
 * A form's open questions and the option ticked. The personal details are
 * left out on purpose: the form game promises they are never sent.
 */
export function formContext(form: FormTask, values: Record<string, string>): WritingContext {
  const questions = form.sections.flatMap((s) => (s.kind === 'question' ? [s.question] : []))
  const ticked = form.sections.flatMap((s) =>
    s.kind === 'choice' && values[s.choice.id] ? [`Ticked under "${s.choice.heading}": ${values[s.choice.id]}`] : [],
  )
  return {
    kind: 'form',
    title: `${form.title}: ${form.formTitle}`,
    situation: form.situation,
    pictures: (form.pictures ?? []).map((p) => p.shows),
    bullets: ticked,
    instructions: form.instructions,
    register: 'a form: formal, answers written about yourself with ik and mijn, or with u',
    points: questions.map((q) => ({ id: q.id, label: q.question })),
    parts: questions.map((q) => ({ id: q.id, label: q.question, text: values[q.id] ?? '' })),
  }
}

/** Same text, same answer: the key a cached hint or review is filed under. */
export function textKey(context: WritingContext): string {
  return JSON.stringify(context.parts.map((p) => p.text.trim()))
}

const SYSTEM = `You are an examiner and tutor for the Dutch DUO inburgering A2 Schrijven (writing) exam. The learner is an adult English speaker who has passed A2 reading and is preparing for the handwritten writing exam: 40 minutes, four tasks (a form, an informal message, a formal e-mail, a short text about yourself).

How DUO marks a task, and how you judge it:
- Every point in the brief is covered, in a way a Dutch reader understands without guessing. This matters most. A sentence whose meaning is unclear does not cover its point.
- Register: u and uw to someone addressed with meneer/mevrouw and a surname; je, jij and jouw to someone addressed by first name. One register throughout.
- Word order: the finite verb second in a main clause; inversion after a fronted time or place ("Morgen kom ik"); the verb at the end after omdat, dat, als, of; a modal or "gaan" with the infinitive at the end ("Ik wil graag Frans leren koken"); separable verbs split in a main clause ("Ik bel u morgen op").
- Verb forms (ik werk, jij werkt, hij werkt; the perfectum with hebben or zijn), spelling, capital letters, full stops.
- English calques that are not Dutch, such as "ik ben leren" for "I am learning" (Dutch says "ik leer" or "ik ben aan het leren").

Judge at A2, not B1. Simple, short sentences are fine. Small slips that do not get in the way of understanding cost little; do not invent problems, and do not ask for richer style. Say plainly when a sentence cannot be understood. Be honest about readiness: never call a text good when a point is missing or unclear.

The greeting and closing are printed on the exam page; the candidate writes only what goes between them (and signs a name, which you are not shown). The brief speaks to the candidate as u, so every bullet has to be turned into ik before it is written.

Language of your answer: every explanation, title and summary is plain, short English, because the learner reads the explanation to learn from it. Dutch appears only where the schema asks for Dutch: quoted or corrected text, sentence starters and example sentences. Keep Dutch at A2 level and, where you can, build it from the learner's own words and situation. Never use the em dash character; use commas, colons or full stops instead.`

function describe(context: WritingContext, patternFindings: string[]): string {
  const lines = [
    `Task type: ${context.kind}`,
    `Title: ${context.title}`,
    `Situation (Dutch): ${context.situation}`,
  ]
  if (context.pictures.length > 0) lines.push(`Pictures shown instead of words: ${context.pictures.join('; ')}`)
  if (context.bullets.length > 0) lines.push('Brief (Dutch):', ...context.bullets.map((b) => `- ${b}`))
  if (context.instructions.length > 0) lines.push(`Instructions (Dutch): ${context.instructions.join(' ')}`)
  lines.push(`Register: ${context.register}`)
  if (context.greeting) lines.push(`Printed above the writing space: ${context.greeting}`)
  if (context.closing) lines.push(`Printed below the writing space: ${context.closing}`)
  if (context.minSentences) lines.push(`Minimum number of sentences: ${context.minSentences}`)
  lines.push('', 'Points the examiner checks (id: point):', ...context.points.map((p) => `- ${p.id}: ${p.label}`))
  lines.push('', 'What the learner wrote:')
  for (const part of context.parts) {
    lines.push(`[${part.id}] ${part.label}`, part.text.trim() === '' ? '(nothing yet)' : part.text.trim(), '')
  }
  if (patternFindings.length > 0) {
    lines.push(
      "The app's own pattern checks currently report (they match words, not meaning, so they can be wrong both ways):",
      ...patternFindings.map((f) => `- ${f}`),
    )
  }
  return lines.join('\n')
}

// ---------------------------------------------------------------------------
// Hint

const HINT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'explain', 'starter', 'example', 'ready'],
  properties: {
    title: { type: 'string', description: 'English, one short line naming the next step.' },
    explain: { type: 'string', description: 'English, one to three sentences: what to do and why, quoting the learner where useful.' },
    starter: { type: 'string', description: 'Dutch: how the sentence that fixes it can begin. Empty string if not useful.' },
    example: { type: 'string', description: 'Dutch: one whole example sentence for this step, fitted to the situation. Empty string if not useful.' },
    ready: { type: 'boolean', description: 'True only when nothing important is left and the learner should submit.' },
  },
} as const

interface HintAnswer {
  title: string
  explain: string
  starter: string
  example: string
  ready: boolean
}

/**
 * The single most useful next step, shaped as an `Issue` so the existing hint
 * ladder shows it: the English first, then the starter, then the example.
 */
export async function claudeHint(key: string, context: WritingContext, patternFindings: string[]): Promise<Issue> {
  const answer = await askJson<HintAnswer>({
    key,
    system: SYSTEM,
    effort: 'low',
    schema: HINT_SCHEMA,
    prompt: `${describe(context, patternFindings)}

The learner pressed Hint. Give the single most useful next step for this text as it stands: first a missing or unclear point, then a register slip, then the error an examiner would mark down most. One step only, and do not write the learner's whole answer for them.`,
  })
  return {
    id: `ai-${textKey(context)}`,
    blocking: !answer.ready,
    title: answer.title,
    explain: answer.explain,
    starter: answer.starter.trim() || undefined,
    example: answer.example.trim() || undefined,
  }
}

// ---------------------------------------------------------------------------
// Review

export type Verdict = 'likely_pass' | 'borderline' | 'not_yet'

export interface Correction {
  /** Dutch, quoted from the learner. */
  original: string
  /** Dutch, the smallest fix. */
  corrected: string
  category: 'content' | 'register' | 'word_order' | 'verb_form' | 'spelling' | 'punctuation' | 'word_choice'
  /** English. */
  explain: string
}

export interface Review {
  verdict: Verdict
  /** English. */
  summary: string
  points: { id: string; covered: boolean; comment: string }[]
  corrections: Correction[]
  /** Per part: what to write. */
  answers: SuggestedAnswer[]
}

export interface SuggestedAnswer {
  /** The part (question, or `body`) this is for. */
  id: string
  /** Dutch: the learner's own text with only the corrections applied. */
  corrected: string
  /** Dutch: a stronger answer at A2 level, built from the learner's idea. */
  example: string
  /** English: what makes the example stronger. */
  why: string
}

const REVIEW_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['verdict', 'summary', 'points', 'corrections', 'answers'],
  properties: {
    verdict: {
      type: 'string',
      enum: ['likely_pass', 'borderline', 'not_yet'],
      description: 'How an A2 examiner would most likely mark this task.',
    },
    summary: { type: 'string', description: 'English, two or three sentences: the honest overall judgement and the one thing to work on.' },
    points: {
      type: 'array',
      description: 'One entry per point the examiner checks, in the order given.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'covered', 'comment'],
        properties: {
          id: { type: 'string' },
          covered: { type: 'boolean', description: 'True only if a Dutch reader would understand this point without guessing.' },
          comment: { type: 'string', description: 'English, one short sentence.' },
        },
      },
    },
    corrections: {
      type: 'array',
      description: 'Every error an examiner would mark, most serious first. Empty if there are none.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['original', 'corrected', 'category', 'explain'],
        properties: {
          original: { type: 'string', description: 'Dutch, quoted exactly from the learner.' },
          corrected: { type: 'string', description: 'Dutch, the smallest change that fixes it.' },
          category: {
            type: 'string',
            enum: ['content', 'register', 'word_order', 'verb_form', 'spelling', 'punctuation', 'word_choice'],
          },
          explain: { type: 'string', description: 'English: the rule, in one or two sentences.' },
        },
      },
    },
    answers: {
      type: 'array',
      description: 'One entry per part the learner wrote, in the order given: what to write.',
      items: {
        type: 'object',
        additionalProperties: false,
        required: ['id', 'corrected', 'example', 'why'],
        properties: {
          id: { type: 'string' },
          corrected: {
            type: 'string',
            description: "Dutch: the learner's own text with only the corrections applied, nothing else changed.",
          },
          example: {
            type: 'string',
            description:
              "Dutch: a stronger answer the learner could write instead, at A2 level: short, simple sentences, the learner's own idea and words where possible, every point fully and clearly covered. For a form question one or two sentences; for a text, the whole text between greeting and closing. If the corrected text is already a strong answer, repeat it exactly.",
          },
          why: {
            type: 'string',
            description: 'English, one sentence: what makes the example stronger, or that the corrected text is already strong.',
          },
        },
      },
    },
  },
} as const

export async function claudeReview(key: string, context: WritingContext, patternFindings: string[]): Promise<Review> {
  return askJson<Review>({
    key,
    system: SYSTEM,
    effort: 'medium',
    schema: REVIEW_SCHEMA,
    prompt: `${describe(context, patternFindings)}

The learner pressed Submit. Mark this task as the A2 examiner would.`,
  })
}
