export type PrepRule =
  | 'om-tijd'
  | 'op-dag'
  | 'in-maand'
  | 'naar-beweging'
  | 'bij-persoon'
  | 'op-plek'
  | 'in-gebouw'
  | 'van-tot'
  | 'met-vervoer'
  | 'vast-werkwoord'

export interface ClockItem {
  id: string
  kind: 'klok'
  hour: number
  minute: number
  answer: string
  accept: string[]
  rule: PrepRule
}

export interface CalendarItem {
  id: string
  kind: 'kalender'
  weekday: string
  day: number
  month: number
  year: number
  answer: string
  accept: string[]
  rule: PrepRule
}

export interface SentenceItem {
  id: string
  kind: 'zin'
  english: string
  before: string
  after: string
  answer: string
  options: string[]
  rule: PrepRule
}

export type PrepItem = ClockItem | CalendarItem | SentenceItem

export const MONTHS = [
  'januari',
  'februari',
  'maart',
  'april',
  'mei',
  'juni',
  'juli',
  'augustus',
  'september',
  'oktober',
  'november',
  'december',
]

export const RULE_EXPLANATIONS: Record<PrepRule, string> = {
  'om-tijd': 'A clock time takes om: om negen uur, om half drie. Careful: "half drie" is 2.30, not 3.30.',
  'op-dag': 'A day or a date takes op: op maandag, op 3 maart. Months and days are written in lower case.',
  'in-maand': 'A month, a year, a season or a part of the day takes in: in juni, in 2026, in het weekend.',
  'naar-beweging': 'Going somewhere takes naar: ik ga naar de dokter.',
  'bij-persoon': 'Being somewhere, with a person or an organisation, takes bij: ik ben bij de gemeente.',
  'op-plek': 'School, work and the office take op: ik werk op school, ik ben op mijn werk.',
  'in-gebouw': 'A building or a city takes in: in het ziekenhuis, in Utrecht.',
  'van-tot': 'A period runs van … tot: ik werk van maandag tot vrijdag.',
  'met-vervoer': 'Transport takes met: met de fiets, met de bus, met de auto.',
  'vast-werkwoord':
    'Some verbs come with a fixed preposition that has to be memorised: wachten op, vragen naar, kijken naar.',
}

export const items: PrepItem[] = [
  // Clock: type the whole phrase, preposition included.
  { id: 'k1', kind: 'klok', hour: 9, minute: 0, answer: 'om negen uur', accept: [], rule: 'om-tijd' },
  {
    id: 'k2',
    kind: 'klok',
    hour: 8,
    minute: 15,
    answer: 'om kwart over acht',
    accept: [],
    rule: 'om-tijd',
  },
  { id: 'k3', kind: 'klok', hour: 2, minute: 30, answer: 'om half drie', accept: [], rule: 'om-tijd' },
  {
    id: 'k4',
    kind: 'klok',
    hour: 8,
    minute: 45,
    answer: 'om kwart voor negen',
    accept: [],
    rule: 'om-tijd',
  },
  {
    id: 'k5',
    kind: 'klok',
    hour: 7,
    minute: 10,
    answer: 'om tien over zeven',
    accept: [],
    rule: 'om-tijd',
  },
  {
    id: 'k6',
    kind: 'klok',
    hour: 5,
    minute: 25,
    answer: 'om vijf voor half zes',
    accept: ['om vijfentwintig over vijf'],
    rule: 'om-tijd',
  },
  { id: 'k7', kind: 'klok', hour: 12, minute: 0, answer: 'om twaalf uur', accept: [], rule: 'om-tijd' },
  {
    id: 'k8',
    kind: 'klok',
    hour: 11,
    minute: 40,
    answer: 'om tien over half twaalf',
    accept: ['om twintig voor twaalf'],
    rule: 'om-tijd',
  },

  // Calendar: type the date with its preposition.
  {
    id: 'd1',
    kind: 'kalender',
    weekday: 'zaterdag',
    day: 3,
    month: 3,
    year: 1990,
    answer: 'op 3 maart 1990',
    accept: ['op zaterdag 3 maart 1990'],
    rule: 'op-dag',
  },
  {
    id: 'd2',
    kind: 'kalender',
    weekday: 'zondag',
    day: 21,
    month: 6,
    year: 2026,
    answer: 'op 21 juni 2026',
    accept: ['op zondag 21 juni 2026'],
    rule: 'op-dag',
  },
  {
    id: 'd3',
    kind: 'kalender',
    weekday: 'donderdag',
    day: 1,
    month: 1,
    year: 2026,
    answer: 'op 1 januari 2026',
    accept: ['op donderdag 1 januari 2026'],
    rule: 'op-dag',
  },
  {
    id: 'd4',
    kind: 'kalender',
    weekday: 'woensdag',
    day: 30,
    month: 9,
    year: 2026,
    answer: 'op 30 september 2026',
    accept: ['op woensdag 30 september 2026'],
    rule: 'op-dag',
  },
  {
    id: 'd5',
    kind: 'kalender',
    weekday: 'vrijdag',
    day: 15,
    month: 8,
    year: 2025,
    answer: 'op 15 augustus 2025',
    accept: ['op vrijdag 15 augustus 2025'],
    rule: 'op-dag',
  },

  // Sentences: pick the preposition that fits.
  {
    id: 'z1',
    kind: 'zin',
    english: "I'm going to the doctor.",
    before: 'Ik ga',
    after: 'de dokter.',
    answer: 'naar',
    options: ['naar', 'bij', 'op', 'in'],
    rule: 'naar-beweging',
  },
  {
    id: 'z2',
    kind: 'zin',
    english: 'I have an appointment on Monday.',
    before: 'Ik heb',
    after: 'maandag een afspraak.',
    answer: 'op',
    options: ['op', 'om', 'in', 'aan'],
    rule: 'op-dag',
  },
  {
    id: 'z3',
    kind: 'zin',
    english: 'The lesson starts at nine.',
    before: 'De les begint',
    after: 'negen uur.',
    answer: 'om',
    options: ['om', 'op', 'in', 'met'],
    rule: 'om-tijd',
  },
  {
    id: 'z4',
    kind: 'zin',
    english: 'My birthday is in June.',
    before: 'Mijn verjaardag is',
    after: 'juni.',
    answer: 'in',
    options: ['in', 'op', 'om', 'van'],
    rule: 'in-maand',
  },
  {
    id: 'z5',
    kind: 'zin',
    english: 'I have to be at the municipality.',
    before: 'Ik moet',
    after: 'de gemeente zijn.',
    answer: 'bij',
    options: ['bij', 'naar', 'op', 'in'],
    rule: 'bij-persoon',
  },
  {
    id: 'z6',
    kind: 'zin',
    english: 'I work at a school.',
    before: 'Ik werk',
    after: 'een school.',
    answer: 'op',
    options: ['op', 'in', 'bij', 'aan'],
    rule: 'op-plek',
  },
  {
    id: 'z7',
    kind: 'zin',
    english: 'She is in hospital.',
    before: 'Zij ligt',
    after: 'het ziekenhuis.',
    answer: 'in',
    options: ['in', 'op', 'bij', 'naar'],
    rule: 'in-gebouw',
  },
  {
    id: 'z8',
    kind: 'zin',
    english: 'I work from Monday to Friday.',
    before: 'Ik werk van maandag',
    after: 'vrijdag.',
    answer: 'tot',
    options: ['tot', 'naar', 'op', 'om'],
    rule: 'van-tot',
  },
  {
    id: 'z9',
    kind: 'zin',
    english: 'I come by bike.',
    before: 'Ik kom',
    after: 'de fiets.',
    answer: 'met',
    options: ['met', 'op', 'in', 'bij'],
    rule: 'met-vervoer',
  },
  {
    id: 'z10',
    kind: 'zin',
    english: 'We live in Utrecht.',
    before: 'Wij wonen',
    after: 'Utrecht.',
    answer: 'in',
    options: ['in', 'op', 'bij', 'naar'],
    rule: 'in-gebouw',
  },
  {
    id: 'z11',
    kind: 'zin',
    english: "I'm free at the weekend.",
    before: 'Ik ben',
    after: 'het weekend vrij.',
    answer: 'in',
    options: ['in', 'op', 'om', 'met'],
    rule: 'in-maand',
  },
  {
    id: 'z12',
    kind: 'zin',
    english: "I'm waiting for you at the entrance.",
    before: 'Ik wacht',
    after: 'je bij de ingang.',
    answer: 'op',
    options: ['op', 'voor', 'naar', 'om'],
    rule: 'vast-werkwoord',
  },
  {
    id: 'z13',
    kind: 'zin',
    english: 'The appointment is at 2 p.m.',
    before: 'De afspraak is',
    after: '14.00 uur.',
    answer: 'om',
    options: ['om', 'op', 'in', 'tot'],
    rule: 'om-tijd',
  },
]
