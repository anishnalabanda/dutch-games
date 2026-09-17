export type Connector = 'en' | 'maar' | 'want' | 'dus' | 'omdat' | 'als' | 'dat' | 'of'

export interface ConnItem {
  id: string
  english: string
  /** First clause, shown as-is. */
  clause1: string
  /** Second clause in normal main-clause order; the finite verb may have to move. */
  clause2: string[]
  verbIndex: number
  connector: Connector
  options: Connector[]
}

/** Connectors that send the finite verb to the end of the clause. */
export const SUBORDINATING: Connector[] = ['omdat', 'als', 'dat', 'of']

export const CONNECTOR_MEANINGS: Record<Connector, string> = {
  en: 'opsomming, je telt iets op',
  maar: 'tegenstelling, het gaat de andere kant op',
  want: 'reden, hetzelfde als omdat, maar met normale volgorde',
  dus: 'gevolg, daarom gebeurt het andere',
  omdat: 'reden, antwoord op "waarom?"',
  als: 'voorwaarde, alleen dán',
  dat: 'na denken, weten, zeggen, hopen',
  of: 'bij twijfel, of bij een ja/nee-vraag',
}

export const ORDER_RULES = {
  main: 'Na en, maar, want en dus blijft de volgorde gewoon: eerst het onderwerp, dan de persoonsvorm.',
  sub: 'Na omdat, als, dat en of gaat de persoonsvorm naar het eind van de zin.',
}

export const items: ConnItem[] = [
  {
    id: 'v1',
    english: "I'm not going to work today, because I'm ill.",
    clause1: 'Ik ga vandaag niet werken,',
    clause2: ['ik', 'ben', 'ziek'],
    verbIndex: 1,
    connector: 'want',
    options: ['want', 'maar', 'dus', 'of'],
  },
  {
    id: 'v2',
    english: "I'm staying home because I'm ill.",
    clause1: 'Ik blijf thuis',
    clause2: ['ik', 'ben', 'ziek'],
    verbIndex: 1,
    connector: 'omdat',
    options: ['omdat', 'maar', 'en', 'dus'],
  },
  {
    id: 'v3',
    english: "I'd like to come, but I don't have time.",
    clause1: 'Ik wil graag komen,',
    clause2: ['ik', 'heb', 'geen', 'tijd'],
    verbIndex: 1,
    connector: 'maar',
    options: ['maar', 'want', 'dus', 'omdat'],
  },
  {
    id: 'v4',
    english: "It's raining hard, so I'm taking the bus.",
    clause1: 'Het regent hard,',
    clause2: ['ik', 'neem', 'de', 'bus'],
    verbIndex: 1,
    connector: 'dus',
    options: ['dus', 'omdat', 'of', 'maar'],
  },
  {
    id: 'v5',
    english: 'I think he is ill.',
    clause1: 'Ik denk',
    clause2: ['hij', 'is', 'ziek'],
    verbIndex: 1,
    connector: 'dat',
    options: ['dat', 'of', 'want', 'dus'],
  },
  {
    id: 'v6',
    english: "I don't know whether he's coming tonight.",
    clause1: 'Ik weet niet',
    clause2: ['hij', 'komt', 'vanavond'],
    verbIndex: 1,
    connector: 'of',
    options: ['of', 'dat', 'want', 'en'],
  },
  {
    id: 'v7',
    english: "I'm learning Dutch because it's important for my work.",
    clause1: 'Ik leer Nederlands',
    clause2: ['het', 'is', 'belangrijk', 'voor', 'mijn', 'werk'],
    verbIndex: 1,
    connector: 'omdat',
    options: ['omdat', 'of', 'maar', 'en'],
  },
  {
    id: 'v8',
    english: "I'm going to the doctor because I've had a headache for a week.",
    clause1: 'Ik ga naar de dokter',
    clause2: ['ik', 'heb', 'al', 'een', 'week', 'hoofdpijn'],
    verbIndex: 1,
    connector: 'omdat',
    options: ['omdat', 'dus', 'maar', 'of'],
  },
  {
    id: 'v9',
    english: "I'll stay home if it rains tomorrow.",
    clause1: 'Ik blijf thuis',
    clause2: ['het', 'regent', 'morgen'],
    verbIndex: 1,
    connector: 'als',
    options: ['als', 'want', 'dus', 'en'],
  },
  {
    id: 'v10',
    english: 'I work on Monday and I study on Tuesday.',
    clause1: 'Ik werk op maandag',
    clause2: ['ik', 'studeer', 'op', 'dinsdag'],
    verbIndex: 1,
    connector: 'en',
    options: ['en', 'omdat', 'of', 'dat'],
  },
  {
    id: 'v11',
    english: "I'll be late, because the train is delayed.",
    clause1: 'Ik kom later,',
    clause2: ['de', 'trein', 'heeft', 'vertraging'],
    verbIndex: 2,
    connector: 'want',
    options: ['want', 'als', 'of', 'maar'],
  },
  {
    id: 'v12',
    english: "I'm calling the doctor because I don't feel well.",
    clause1: 'Ik bel de dokter',
    clause2: ['ik', 'voel', 'me', 'niet', 'goed'],
    verbIndex: 1,
    connector: 'omdat',
    options: ['omdat', 'dus', 'en', 'of'],
  },
]
