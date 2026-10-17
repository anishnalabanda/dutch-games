/**
 * Steps 2 and 3 of a Luisteren word game, written per theme in this folder.
 *
 * A sentence is `[dutch, english, wrong, wrong]`: hear the Dutch, pick the
 * English. The two wrong meanings differ from the right one only in the detail
 * the ear has to catch (dertien / dertig, morgen / vandaag, wel / niet), so the
 * sentence cannot be answered from one familiar word.
 *
 * A conversation is the exam's shape: a man and a woman, two to four lines, a
 * Dutch question and three Dutch options. Every option is said or hinted at in
 * the conversation, so only the line that settles it gives the answer.
 */
export type SentenceEntry = [nl: string, en: string, wrong1: string, wrong2: string]

export type Speaker = 'm' | 'v'

export interface ConversationEntry {
  /** Unique within the theme: 'g01', 'g02', ... */
  id: string
  lines: [who: Speaker, nl: string][]
  /** Dutch, as the exam asks it: "Wanneer komt de monteur?" */
  question: string
  /** Dutch, short: "Op dinsdag." */
  options: [string, string, string]
  answer: 0 | 1 | 2
  /** English: which line settles it, and why the other two are wrong. */
  why: string
}

export interface ThemeSteps {
  sentences: SentenceEntry[]
  conversations: ConversationEntry[]
}
