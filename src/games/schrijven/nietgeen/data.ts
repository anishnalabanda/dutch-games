export type NegWord = 'niet' | 'geen'
export type NegRule =
  | 'geen'
  | 'niet-eind'
  | 'niet-adjectief'
  | 'niet-voorzetsel'
  | 'niet-werkwoord'

export interface NegItem {
  id: string
  english: string
  /** Words of the sentence, without the negation and without end punctuation. */
  tokens: string[]
  word: NegWord
  /** Index in `tokens` the negation goes in front of; tokens.length = at the end. */
  position: number
  end: string
  rule: NegRule
}

export const RULE_LABELS: Record<NegRule, string> = {
  geen: 'Geen',
  'niet-eind': 'Niet aan het eind',
  'niet-adjectief': 'Niet voor een bijvoeglijk naamwoord',
  'niet-voorzetsel': 'Niet voor een voorzetsel',
  'niet-werkwoord': 'Niet voor het werkwoord',
}

export const RULE_EXPLANATIONS: Record<NegRule, string> = {
  geen: 'Geen gebruik je vóór een zelfstandig naamwoord met "een" of zonder lidwoord. "Ik heb een auto" wordt "Ik heb geen auto".',
  'niet-eind':
    'Bij een bepaald woord (de, het, die, mijn) gebruik je niet. Volgt er niets meer? Dan staat niet aan het eind.',
  'niet-adjectief': 'Niet staat vóór een bijvoeglijk naamwoord: "Hij is niet ziek".',
  'niet-voorzetsel':
    'Niet staat vóór een groep met een voorzetsel (in, naar, om, op), en ná een tijdsbepaling: "Ik ga vandaag niet naar school".',
  'niet-werkwoord':
    'Niet staat vóór een werkwoord aan het eind van de zin (hele werkwoord of deelwoord): "Ik wil niet werken", "Ik heb de brief niet gelezen".',
}

export const items: NegItem[] = [
  {
    id: 'n1',
    english: "I don't have a car.",
    tokens: ['Ik', 'heb', 'auto'],
    word: 'geen',
    position: 2,
    end: '.',
    rule: 'geen',
  },
  {
    id: 'n2',
    english: "I don't drink coffee.",
    tokens: ['Ik', 'drink', 'koffie'],
    word: 'geen',
    position: 2,
    end: '.',
    rule: 'geen',
  },
  {
    id: 'n3',
    english: "I don't know that man.",
    tokens: ['Ik', 'ken', 'die', 'man'],
    word: 'niet',
    position: 4,
    end: '.',
    rule: 'niet-eind',
  },
  {
    id: 'n4',
    english: "The book isn't interesting.",
    tokens: ['Het', 'boek', 'is', 'interessant'],
    word: 'niet',
    position: 3,
    end: '.',
    rule: 'niet-adjectief',
  },
  {
    id: 'n5',
    english: "I'm not going to school today.",
    tokens: ['Ik', 'ga', 'vandaag', 'naar', 'school'],
    word: 'niet',
    position: 3,
    end: '.',
    rule: 'niet-voorzetsel',
  },
  {
    id: 'n6',
    english: "She doesn't live in Amsterdam.",
    tokens: ['Zij', 'woont', 'in', 'Amsterdam'],
    word: 'niet',
    position: 2,
    end: '.',
    rule: 'niet-voorzetsel',
  },
  {
    id: 'n7',
    english: "We don't have time.",
    tokens: ['Wij', 'hebben', 'tijd'],
    word: 'geen',
    position: 2,
    end: '.',
    rule: 'geen',
  },
  {
    id: 'n8',
    english: "I don't want to work today.",
    tokens: ['Ik', 'wil', 'vandaag', 'werken'],
    word: 'niet',
    position: 3,
    end: '.',
    rule: 'niet-werkwoord',
  },
  {
    id: 'n9',
    english: "The lesson doesn't start at nine.",
    tokens: ['De', 'les', 'begint', 'om', 'negen', 'uur'],
    word: 'niet',
    position: 3,
    end: '.',
    rule: 'niet-voorzetsel',
  },
  {
    id: 'n10',
    english: "I'm not hungry.",
    tokens: ['Ik', 'heb', 'honger'],
    word: 'geen',
    position: 2,
    end: '.',
    rule: 'geen',
  },
  {
    id: 'n11',
    english: "He isn't ill.",
    tokens: ['Hij', 'is', 'ziek'],
    word: 'niet',
    position: 2,
    end: '.',
    rule: 'niet-adjectief',
  },
  {
    id: 'n12',
    english: "I haven't read the letter.",
    tokens: ['Ik', 'heb', 'de', 'brief', 'gelezen'],
    word: 'niet',
    position: 4,
    end: '.',
    rule: 'niet-werkwoord',
  },
  {
    id: 'n13',
    english: 'There are no chairs.',
    tokens: ['Er', 'zijn', 'stoelen'],
    word: 'geen',
    position: 2,
    end: '.',
    rule: 'geen',
  },
  {
    id: 'n14',
    english: "I don't like that.",
    tokens: ['Ik', 'vind', 'dat', 'leuk'],
    word: 'niet',
    position: 3,
    end: '.',
    rule: 'niet-adjectief',
  },
  {
    id: 'n15',
    english: "She doesn't speak Dutch.",
    tokens: ['Zij', 'spreekt', 'Nederlands'],
    word: 'geen',
    position: 2,
    end: '.',
    rule: 'geen',
  },
  {
    id: 'n16',
    english: "I can't come today.",
    tokens: ['Ik', 'kan', 'vandaag', 'komen'],
    word: 'niet',
    position: 3,
    end: '.',
    rule: 'niet-werkwoord',
  },
  {
    id: 'n17',
    english: 'My neighbour has no children.',
    tokens: ['Mijn', 'buurman', 'heeft', 'kinderen'],
    word: 'geen',
    position: 3,
    end: '.',
    rule: 'geen',
  },
  {
    id: 'n18',
    english: "I don't understand the letter.",
    tokens: ['Ik', 'begrijp', 'de', 'brief'],
    word: 'niet',
    position: 4,
    end: '.',
    rule: 'niet-eind',
  },
]
