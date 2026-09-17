export type QuestionType = 'vraagwoord' | 'janee'

export interface QuestionItem {
  id: string
  /** The answer sentence, split around the part that is being asked about. */
  before: string
  focus: string
  after: string
  /** The model question. */
  question: string
  /** Other correct phrasings, including u-forms. */
  accept: string[]
  type: QuestionType
  /** Shown when the player asks for a hint. */
  hint: string
}

export const TYPE_RULES: Record<QuestionType, string> = {
  vraagwoord:
    'Vraagwoord eerst, dan de persoonsvorm, dan het onderwerp: "Waar woon je?", niet "Waar je woont?".',
  janee:
    'Een ja/nee-vraag begint met de persoonsvorm: "Woon je in Utrecht?". Na jij/je valt de -t weg.',
}

export const items: QuestionItem[] = [
  {
    id: 'q1',
    before: 'Ik woon ',
    focus: 'in Utrecht',
    after: '.',
    question: 'Waar woon je?',
    accept: ['Waar woon jij?', 'Waar woont u?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een plaats.',
  },
  {
    id: 'q2',
    before: 'Ik ben ',
    focus: '34 jaar',
    after: '.',
    question: 'Hoe oud ben je?',
    accept: ['Hoe oud ben jij?', 'Hoe oud bent u?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een leeftijd.',
  },
  {
    id: 'q3',
    before: 'De les begint ',
    focus: 'om negen uur',
    after: '.',
    question: 'Hoe laat begint de les?',
    accept: ['Wanneer begint de les?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een tijd.',
  },
  {
    id: 'q4',
    before: 'Ik kom ',
    focus: 'uit India',
    after: '.',
    question: 'Waar kom je vandaan?',
    accept: ['Waar kom jij vandaan?', 'Waar komt u vandaan?', 'Uit welk land kom je?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar het land van herkomst, let op het woordje "vandaan".',
  },
  {
    id: 'q5',
    before: 'Het boek kost ',
    focus: 'tien euro',
    after: '.',
    question: 'Hoeveel kost het boek?',
    accept: ['Wat kost het boek?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een prijs.',
  },
  {
    id: 'q6',
    before: 'Ik heet ',
    focus: 'Sara',
    after: '.',
    question: 'Hoe heet je?',
    accept: ['Hoe heet jij?', 'Hoe heet u?', 'Wat is je naam?', 'Wat is uw naam?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een naam.',
  },
  {
    id: 'q7',
    before: '',
    focus: 'Mijn buurvrouw',
    after: ' is ziek.',
    question: 'Wie is ziek?',
    accept: [],
    type: 'vraagwoord',
    hint: 'Je vraagt naar de persoon, het onderwerp van de zin.',
  },
  {
    id: 'q8',
    before: 'Ik ga ',
    focus: 'morgen',
    after: ' naar de tandarts.',
    question: 'Wanneer ga je naar de tandarts?',
    accept: ['Wanneer ga jij naar de tandarts?', 'Wanneer gaat u naar de tandarts?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een moment.',
  },
  {
    id: 'q9',
    before: 'Ik blijf thuis ',
    focus: 'omdat ik ziek ben',
    after: '.',
    question: 'Waarom blijf je thuis?',
    accept: ['Waarom blijf jij thuis?', 'Waarom blijft u thuis?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar de reden.',
  },
  {
    id: 'q10',
    before: 'Ik ga ',
    focus: 'met de fiets',
    after: ' naar mijn werk.',
    question: 'Hoe ga je naar je werk?',
    accept: [
      'Hoe ga jij naar je werk?',
      'Hoe gaat u naar uw werk?',
      'Hoe ga je naar het werk?',
      'Hoe ga je naar werk?',
    ],
    type: 'vraagwoord',
    hint: 'Je vraagt naar de manier, met de bus, de fiets, de auto.',
  },
  {
    id: 'q11',
    before: 'Ik werk ',
    focus: 'bij een school',
    after: '.',
    question: 'Waar werk je?',
    accept: ['Waar werk jij?', 'Waar werkt u?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar de plaats van het werk.',
  },
  {
    id: 'q12',
    before: 'Wij hebben ',
    focus: 'twee',
    after: ' kinderen.',
    question: 'Hoeveel kinderen hebben jullie?',
    accept: ['Hoeveel kinderen heeft u?', 'Hoeveel kinderen hebben jullie samen?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een aantal.',
  },
  {
    id: 'q13',
    before: 'De cursus duurt ',
    focus: 'drie maanden',
    after: '.',
    question: 'Hoelang duurt de cursus?',
    accept: ['Hoe lang duurt de cursus?'],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een duur.',
  },
  {
    id: 'q14',
    before: 'Dat is ',
    focus: 'mijn broer',
    after: '.',
    question: 'Wie is dat?',
    accept: [],
    type: 'vraagwoord',
    hint: 'Je vraagt naar een persoon.',
  },
  {
    id: 'q15',
    before: 'Ja, ',
    focus: 'ik woon in Utrecht',
    after: '.',
    question: 'Woon je in Utrecht?',
    accept: ['Woon jij in Utrecht?', 'Woont u in Utrecht?'],
    type: 'janee',
    hint: 'Begin met het werkwoord. Let op: na "je" valt de -t weg.',
  },
  {
    id: 'q16',
    before: 'Ja, ',
    focus: 'ik heb een afspraak',
    after: '.',
    question: 'Heb je een afspraak?',
    accept: ['Heb jij een afspraak?', 'Heeft u een afspraak?'],
    type: 'janee',
    hint: 'Begin met het werkwoord: "heb" bij je/jij, "heeft" bij u.',
  },
  {
    id: 'q17',
    before: 'Ja, ',
    focus: 'de dokter kan mij vandaag zien',
    after: '.',
    question: 'Kan de dokter mij vandaag zien?',
    accept: ['Kan de dokter me vandaag zien?'],
    type: 'janee',
    hint: 'Begin met de persoonsvorm, daarna het onderwerp.',
  },
]
