import type { KnmQuestion } from './types'
import { questions as geografie } from './data/geografie'
import { questions as gezondheid } from './data/gezondheid'
import { questions as instanties } from './data/instanties'
import { questions as staat } from './data/staat'
import { questions as onderwijs } from './data/onderwijs'
import { questions as wonen } from './data/wonen'
import { questions as werk } from './data/werk'
import { questions as omgang } from './data/omgang'

export type KnmThemeId = 'geografie' | 'gezondheid' | 'instanties' | 'staat' | 'onderwijs' | 'wonen' | 'werk' | 'omgang'

export interface KnmTheme {
  id: KnmThemeId
  /** The book's theme number, to find a question on paper. */
  book: number
  title: string
  subtitle: string
  questions: KnmQuestion[]
}

/** One game per theme of the owner's book, in the book's order. */
export const KNM_THEMES: KnmTheme[] = [
  { id: 'geografie', book: 1, title: 'Geografie en geschiedenis', subtitle: 'Geography and history', questions: geografie },
  { id: 'gezondheid', book: 2, title: 'Gezondheid en gezondheidszorg', subtitle: 'Health and healthcare', questions: gezondheid },
  { id: 'instanties', book: 3, title: 'Instanties', subtitle: 'Government bodies and organisations', questions: instanties },
  { id: 'staat', book: 4, title: 'Staatsinrichting en rechtsstaat', subtitle: 'How the state works, and the rule of law', questions: staat },
  { id: 'onderwijs', book: 5, title: 'Onderwijs en opvoeding', subtitle: 'School and raising children', questions: onderwijs },
  { id: 'wonen', book: 6, title: 'Wonen', subtitle: 'Housing and neighbours', questions: wonen },
  { id: 'werk', book: 7, title: 'Werk en inkomen', subtitle: 'Work and income', questions: werk },
  { id: 'omgang', book: 8, title: 'Omgangsvormen, normen en waarden', subtitle: 'Manners, norms and values', questions: omgang },
]

export const STORE_PREFIX = 'nl.knm.'

export function themeFromKey(key: string): KnmTheme | null {
  const id = key.startsWith(STORE_PREFIX) ? key.slice(STORE_PREFIX.length) : ''
  return KNM_THEMES.find((t) => t.id === id) ?? null
}
