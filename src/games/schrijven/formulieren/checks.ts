import { grammarAdvice, hasKeyword, shapeIssues, wordsOf } from '../taken/checks'
import type { Issue } from '../taken/types'
import { FORMAT_HELP, fieldValid, sampleValue } from './fields'
import type { FormTask, OpenQuestion } from './data'

export const MIN_WORDS = 4

const INFORMAL = /\b(je|jij|jou|jouw)\b/gi

/** A choice with nothing ticked keeps this value. */
export const UNCHOSEN = ''

export function answered(q: OpenQuestion, text: string): boolean {
  return q.needs.every((group) => hasKeyword(text, group))
}

/** Every issue with one answer to an open question, blocking first. */
export function answerIssues(q: OpenQuestion, text: string, covered: boolean): Issue[] {
  const trimmed = text.trim()
  const prefix = `${q.id}-`
  const help = { starter: q.starter, example: q.example, target: q.id }

  if (trimmed === '') {
    return [
      {
        id: `${prefix}leeg`,
        blocking: true,
        title: `Not answered yet: ${q.question}`,
        explain:
          'Answer in a whole sentence. Reuse the words of the question: "Waarom wilt u …?" becomes "Ik wil …, omdat …".',
        ...help,
      },
    ]
  }

  const issues: Issue[] = []
  if (!covered && !answered(q, trimmed)) {
    issues.push({
      id: `${prefix}antwoord`,
      blocking: true,
      title: `Answer the question: ${q.question}`,
      explain: `I can't find ${q.expects} in your answer yet. I look for typical words, so if your answer does say it, tick "I covered this".`,
      ...help,
    })
  }
  if (wordsOf(trimmed).length < MIN_WORDS) {
    issues.push({
      id: `${prefix}lengte`,
      blocking: true,
      title: 'Write a whole sentence',
      explain: `Use at least ${MIN_WORDS} words, with a subject and a verb. One word shows the examiner very little of your Dutch.`,
      ...help,
    })
  }
  const informal = trimmed.match(INFORMAL) ?? []
  if (informal.length > 0) {
    issues.push({
      id: `${prefix}register`,
      blocking: true,
      title: 'A form is formal',
      explain: `I see ${[...new Set(informal.map((w) => `"${w.toLowerCase()}"`))].join(', ')}. On a form, write u and uw, or write about yourself with ik and mijn.`,
      target: q.id,
    })
  }
  issues.push(...shapeIssues(trimmed, prefix, q.id))
  issues.push(...grammarAdvice(trimmed, prefix, q.id))
  return issues
}

interface FormInput {
  form: FormTask
  values: Record<string, string>
  covered: Set<string>
  today: Date
}

/** Every issue with the form, top to bottom, all blocking issues before any advice. */
export function formIssues({ form, values, covered, today }: FormInput): Issue[] {
  const blocking: Issue[] = []
  const advice: Issue[] = []

  for (const section of form.sections) {
    if (section.kind === 'fields') {
      for (const field of section.fields) {
        const value = values[field.id] ?? ''
        if (fieldValid(field.kind, value, today)) continue
        blocking.push({
          id: `veld-${field.id}`,
          blocking: true,
          title: value.trim() === '' ? `Fill in: ${field.label}` : `Check the format: ${field.label}`,
          explain: FORMAT_HELP[field.kind],
          example: sampleValue(field.kind, today),
          target: field.id,
        })
      }
    } else if (section.kind === 'choice') {
      if ((values[section.choice.id] ?? UNCHOSEN) === UNCHOSEN) {
        blocking.push({
          id: `keuze-${section.choice.id}`,
          blocking: true,
          title: `Choose one: ${section.choice.heading}`,
          explain: 'Tick exactly one option. On paper, colour in one circle clearly or put a cross in it.',
          target: section.choice.id,
        })
      }
    } else {
      const q = section.question
      for (const issue of answerIssues(q, values[q.id] ?? '', covered.has(q.id))) {
        ;(issue.blocking ? blocking : advice).push(issue)
      }
    }
  }

  return [...blocking, ...advice]
}
