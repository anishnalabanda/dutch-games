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
  /** Why this word takes this article, when there is a pattern to lean on. */
  hint: string
  follow?: Follow
}

export const ADJ_RULES: Record<AdjRule, string> = {
  'de-altijd-e': 'Bij een de-woord krijgt het bijvoeglijk naamwoord altijd een -e: de grote stad, een grote stad.',
  'het-bepaald-e':
    'Bij een het-woord met het, dit, dat of mijn krijgt het bijvoeglijk naamwoord ook een -e: het grote huis.',
  'het-een-geen-e':
    'Bij een het-woord met een (of zonder lidwoord) krijgt het bijvoeglijk naamwoord géén -e: een groot huis.',
}

export const ARTICLE_PATTERNS = [
  'Verkleinwoorden op -je zijn altijd het: het meisje, het kopje.',
  'Woorden op -ing, -heid, -tie en -teit zijn de-woorden: de vergadering, de gezondheid.',
  'In het meervoud is het altijd de: de huizen, de kinderen.',
  'Bij de rest hoort het lidwoord gewoon bij het woord: leer ze samen.',
]

export const items: NounItem[] = [
  {
    id: 'a1',
    noun: 'huis',
    gloss: 'house',
    article: 'het',
    hint: 'Een van de het-woorden die je uit je hoofd leert.',
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
    hint: 'Een de-woord.',
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
    hint: 'Een het-woord.',
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
    hint: 'Verkleinwoorden op -je zijn altijd het-woorden.',
  },
  {
    id: 'a5',
    noun: 'kopje',
    gloss: 'cup',
    article: 'het',
    hint: 'Verkleinwoorden op -je zijn altijd het-woorden.',
  },
  {
    id: 'a6',
    noun: 'vergadering',
    gloss: 'meeting',
    article: 'de',
    hint: 'Woorden op -ing zijn de-woorden.',
  },
  {
    id: 'a7',
    noun: 'gezondheid',
    gloss: 'health',
    article: 'de',
    hint: 'Woorden op -heid zijn de-woorden.',
  },
  {
    id: 'a8',
    noun: 'informatie',
    gloss: 'information',
    article: 'de',
    hint: 'Woorden op -tie zijn de-woorden.',
  },
  {
    id: 'a9',
    noun: 'kinderen',
    gloss: 'children',
    article: 'de',
    hint: 'In het meervoud is het altijd de.',
  },
  {
    id: 'a10',
    noun: 'formulier',
    gloss: 'form',
    article: 'het',
    hint: 'Een het-woord, handig om te kennen voor het examen.',
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
    hint: 'Een de-woord.',
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
    hint: 'Een het-woord, maar het meervoud is "de kinderen".',
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
    hint: 'Een de-woord.',
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
    hint: 'Een het-woord.',
    follow: {
      before: 'mijn',
      after: 'werk',
      adjective: 'nieuw',
      options: ['nieuw', 'nieuwe'],
      answer: 'nieuwe',
      rule: 'het-bepaald-e',
    },
  },
  { id: 'a15', noun: 'ziekenhuis', gloss: 'hospital', article: 'het', hint: 'Een het-woord.' },
  { id: 'a16', noun: 'station', gloss: 'station', article: 'het', hint: 'Een het-woord.' },
  { id: 'a17', noun: 'gesprek', gloss: 'conversation', article: 'het', hint: 'Een het-woord.' },
  { id: 'a18', noun: 'sleutel', gloss: 'key', article: 'de', hint: 'Een de-woord.' },
  { id: 'a19', noun: 'dokter', gloss: 'doctor', article: 'de', hint: 'Een de-woord.' },
  { id: 'a20', noun: 'week', gloss: 'week', article: 'de', hint: 'Een de-woord.' },
  { id: 'a21', noun: 'geld', gloss: 'money', article: 'het', hint: 'Een het-woord.' },
  { id: 'a22', noun: 'les', gloss: 'lesson', article: 'de', hint: 'Een de-woord.' },
]
