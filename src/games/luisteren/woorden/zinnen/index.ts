/**
 * Steps 2 and 3 of every Luisteren word game, one file per theme (see types.ts).
 */
import { shuffle } from '../../../normalize'
import type { ThemeId } from '../data'
import type { ConversationEntry, ThemeSteps } from './types'
import { steps as vragen } from './vragen'
import { steps as tijd } from './tijd'
import { steps as getallen } from './getallen'
import { steps as kleinewoorden } from './kleinewoorden'
import { steps as voorzetsels } from './voorzetsels'
import { steps as verwijswoorden } from './verwijswoorden'
import { steps as werkwoorden } from './werkwoorden'
import { steps as gezondheid } from './gezondheid'
import { steps as werk } from './werk'
import { steps as wonen } from './wonen'
import { steps as school } from './school'
import { steps as winkelen } from './winkelen'
import { steps as reizen } from './reizen'
import { steps as route } from './route'
import { steps as instanties } from './instanties'
import { steps as vrijetijd } from './vrijetijd'

const BY_THEME: Record<ThemeId, ThemeSteps> = {
  vragen,
  tijd,
  getallen,
  kleinewoorden,
  voorzetsels,
  verwijswoorden,
  werkwoorden,
  gezondheid,
  werk,
  wonen,
  school,
  winkelen,
  reizen,
  route,
  instanties,
  vrijetijd,
}

export interface ListenSentence {
  /** Stable: the theme plus the Dutch, so editing the list keeps saved progress. */
  id: string
  nl: string
  en: string
  wrong: [string, string]
}

export interface ListenConversation extends ConversationEntry {
  /** The theme plus the entry's own id: "werk:g03". */
  id: string
}

/** Saved next to the word game's own key; the hub counts the words. */
export const SENTENCES_SUFFIX = '-zinnen'
export const CONVERSATIONS_SUFFIX = '-gesprek'

/** One stable array per theme: `useDrill` needs the same reference on every render. */
export const sentencesByTheme = Object.fromEntries(
  Object.entries(BY_THEME).map(([theme, s]) => [
    theme,
    s.sentences.map(([nl, en, w1, w2]) => ({ id: `${theme}:${nl}`, nl, en, wrong: [w1, w2] })),
  ]),
) as Record<ThemeId, ListenSentence[]>

export const conversationsByTheme = Object.fromEntries(
  Object.entries(BY_THEME).map(([theme, s]) => [theme, s.conversations.map((c) => ({ ...c, id: `${theme}:${c.id}` }))]),
) as Record<ThemeId, ListenConversation[]>

/** The right meaning and its two near misses, in a new order every time. */
export function sentenceOptions(sentence: ListenSentence): string[] {
  return shuffle([sentence.en, ...sentence.wrong])
}
