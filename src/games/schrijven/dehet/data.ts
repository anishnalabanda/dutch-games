export type Article = 'de' | 'het'

export interface Follow {
  /** Phrase around the gap, e.g. ["een", "huis"]. */
  before: string
  after: string
  adjective: string
  options: [string, string]
  answer: string
  rule: AdjRule
}

export type AdjRule = 'de-altijd-e' | 'het-bepaald-e' | 'het-een-geen-e'

export interface NounItem {
  id: string
  noun: string
  gloss: string
  article: Article
  /** Why this word takes this article, in English, when there is a pattern to lean on. */
  hint: string
  follow?: Follow
}

export const ADJ_RULES: Record<AdjRule, string> = {
  'de-altijd-e': 'With a de-word the adjective always takes an -e: de grote stad, een grote stad.',
  'het-bepaald-e':
    'With a het-word after het, dit, dat or mijn the adjective takes an -e too: het grote huis.',
  'het-een-geen-e':
    'With a het-word after een (or with no article) the adjective takes no -e: een groot huis.',
}

export const ARTICLE_PATTERNS = [
  'Diminutives ending in -je are always het: het meisje, het kopje.',
  'Words ending in -ing, -heid, -tie and -teit are de-words: de vergadering, de gezondheid.',
  'In the plural it is always de: de huizen, de kinderen.',
  'For the rest the article is simply part of the word: learn the two together.',
]

export const items: NounItem[] = [
  {
    id: 'a1',
    noun: 'huis',
    gloss: 'house',
    article: 'het',
    hint: 'One of the het-words that simply has to be memorised.',
    follow: {
      before: 'een',
      after: 'huis',
      adjective: 'groot',
      options: ['groot', 'grote'],
      answer: 'groot',
      rule: 'het-een-geen-e',
    },
  },
  {
    id: 'a2',
    noun: 'stad',
    gloss: 'city',
    article: 'de',
    hint: 'A de-word.',
    follow: {
      before: 'een',
      after: 'stad',
      adjective: 'groot',
      options: ['groot', 'grote'],
      answer: 'grote',
      rule: 'de-altijd-e',
    },
  },
  {
    id: 'a3',
    noun: 'boek',
    gloss: 'book',
    article: 'het',
    hint: 'A het-word.',
    follow: {
      before: 'het',
      after: 'boek',
      adjective: 'nieuw',
      options: ['nieuw', 'nieuwe'],
      answer: 'nieuwe',
      rule: 'het-bepaald-e',
    },
  },
  {
    id: 'a4',
    noun: 'meisje',
    gloss: 'girl',
    article: 'het',
    hint: 'Diminutives ending in -je are always het-words.',
  },
  {
    id: 'a5',
    noun: 'kopje',
    gloss: 'cup',
    article: 'het',
    hint: 'Diminutives ending in -je are always het-words.',
  },
  {
    id: 'a6',
    noun: 'vergadering',
    gloss: 'meeting',
    article: 'de',
    hint: 'Words ending in -ing are de-words.',
  },
  {
    id: 'a7',
    noun: 'gezondheid',
    gloss: 'health',
    article: 'de',
    hint: 'Words ending in -heid are de-words.',
  },
  {
    id: 'a8',
    noun: 'informatie',
    gloss: 'information',
    article: 'de',
    hint: 'Words ending in -tie are de-words.',
  },
  {
    id: 'a9',
    noun: 'kinderen',
    gloss: 'children',
    article: 'de',
    hint: 'In the plural it is always de.',
  },
  {
    id: 'a10',
    noun: 'formulier',
    gloss: 'form',
    article: 'het',
    hint: 'A het-word, worth knowing for the exam.',
    follow: {
      before: 'een',
      after: 'formulier',
      adjective: 'moeilijk',
      options: ['moeilijk', 'moeilijke'],
      answer: 'moeilijk',
      rule: 'het-een-geen-e',
    },
  },
  {
    id: 'a11',
    noun: 'brief',
    gloss: 'letter',
    article: 'de',
    hint: 'A de-word.',
    follow: {
      before: 'een',
      after: 'brief',
      adjective: 'lang',
      options: ['lang', 'lange'],
      answer: 'lange',
      rule: 'de-altijd-e',
    },
  },
  {
    id: 'a12',
    noun: 'kind',
    gloss: 'child',
    article: 'het',
    hint: 'A het-word, but the plural is "de kinderen".',
    follow: {
      before: 'een',
      after: 'kind',
      adjective: 'klein',
      options: ['klein', 'kleine'],
      answer: 'klein',
      rule: 'het-een-geen-e',
    },
  },
  {
    id: 'a13',
    noun: 'afspraak',
    gloss: 'appointment',
    article: 'de',
    hint: 'A de-word.',
    follow: {
      before: 'de',
      after: 'afspraak',
      adjective: 'volgend',
      options: ['volgend', 'volgende'],
      answer: 'volgende',
      rule: 'de-altijd-e',
    },
  },
  {
    id: 'a14',
    noun: 'werk',
    gloss: 'work',
    article: 'het',
    hint: 'A het-word.',
    follow: {
      before: 'mijn',
      after: 'werk',
      adjective: 'nieuw',
      options: ['nieuw', 'nieuwe'],
      answer: 'nieuwe',
      rule: 'het-bepaald-e',
    },
  },
  { id: 'a15', noun: 'ziekenhuis', gloss: 'hospital', article: 'het', hint: 'A het-word.' },
  { id: 'a16', noun: 'station', gloss: 'station', article: 'het', hint: 'A het-word.' },
  { id: 'a17', noun: 'gesprek', gloss: 'conversation', article: 'het', hint: 'A het-word.' },
  { id: 'a18', noun: 'sleutel', gloss: 'key', article: 'de', hint: 'A de-word.' },
  { id: 'a19', noun: 'dokter', gloss: 'doctor', article: 'de', hint: 'A de-word.' },
  { id: 'a20', noun: 'week', gloss: 'week', article: 'de', hint: 'A de-word.' },
  { id: 'a21', noun: 'geld', gloss: 'money', article: 'het', hint: 'A het-word.' },
  { id: 'a22', noun: 'les', gloss: 'lesson', article: 'de', hint: 'A de-word.' },
]
