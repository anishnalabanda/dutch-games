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
    'Question word first, then the finite verb, then the subject: "Waar woon je?", not "Waar je woont?".',
  janee:
    'A yes/no question starts with the finite verb: "Woon je in Utrecht?". After jij/je the -t drops.',
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
    hint: 'You are asking about a place.',
  },
  {
    id: 'q2',
    before: 'Ik ben ',
    focus: '34 jaar',
    after: '.',
    question: 'Hoe oud ben je?',
    accept: ['Hoe oud ben jij?', 'Hoe oud bent u?'],
    type: 'vraagwoord',
    hint: 'You are asking about an age.',
  },
  {
    id: 'q3',
    before: 'De les begint ',
    focus: 'om negen uur',
    after: '.',
    question: 'Hoe laat begint de les?',
    accept: ['Wanneer begint de les?'],
    type: 'vraagwoord',
    hint: 'You are asking about a time.',
  },
  {
    id: 'q4',
    before: 'Ik kom ',
    focus: 'uit India',
    after: '.',
    question: 'Waar kom je vandaan?',
    accept: ['Waar kom jij vandaan?', 'Waar komt u vandaan?', 'Uit welk land kom je?'],
    type: 'vraagwoord',
    hint: 'You are asking which country someone is from; mind the little word "vandaan".',
  },
  {
    id: 'q5',
    before: 'Het boek kost ',
    focus: 'tien euro',
    after: '.',
    question: 'Hoeveel kost het boek?',
    accept: ['Wat kost het boek?'],
    type: 'vraagwoord',
    hint: 'You are asking about a price.',
  },
  {
    id: 'q6',
    before: 'Ik heet ',
    focus: 'Sara',
    after: '.',
    question: 'Hoe heet je?',
    accept: ['Hoe heet jij?', 'Hoe heet u?', 'Wat is je naam?', 'Wat is uw naam?'],
    type: 'vraagwoord',
    hint: 'You are asking about a name.',
  },
  {
    id: 'q7',
    before: '',
    focus: 'Mijn buurvrouw',
    after: ' is ziek.',
    question: 'Wie is ziek?',
    accept: [],
    type: 'vraagwoord',
    hint: 'You are asking about the person, the subject of the sentence.',
  },
  {
    id: 'q8',
    before: 'Ik ga ',
    focus: 'morgen',
    after: ' naar de tandarts.',
    question: 'Wanneer ga je naar de tandarts?',
    accept: ['Wanneer ga jij naar de tandarts?', 'Wanneer gaat u naar de tandarts?'],
    type: 'vraagwoord',
    hint: 'You are asking about a moment in time.',
  },
  {
    id: 'q9',
    before: 'Ik blijf thuis ',
    focus: 'omdat ik ziek ben',
    after: '.',
    question: 'Waarom blijf je thuis?',
    accept: ['Waarom blijf jij thuis?', 'Waarom blijft u thuis?'],
    type: 'vraagwoord',
    hint: 'You are asking about the reason.',
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
    hint: 'You are asking how, by bus, by bike, by car.',
  },
  {
    id: 'q11',
    before: 'Ik werk ',
    focus: 'bij een school',
    after: '.',
    question: 'Waar werk je?',
    accept: ['Waar werk jij?', 'Waar werkt u?'],
    type: 'vraagwoord',
    hint: 'You are asking where the work is.',
  },
  {
    id: 'q12',
    before: 'Wij hebben ',
    focus: 'twee',
    after: ' kinderen.',
    question: 'Hoeveel kinderen hebben jullie?',
    accept: ['Hoeveel kinderen heeft u?', 'Hoeveel kinderen hebben jullie samen?'],
    type: 'vraagwoord',
    hint: 'You are asking about a number of things.',
  },
  {
    id: 'q13',
    before: 'De cursus duurt ',
    focus: 'drie maanden',
    after: '.',
    question: 'Hoelang duurt de cursus?',
    accept: ['Hoe lang duurt de cursus?'],
    type: 'vraagwoord',
    hint: 'You are asking how long something takes.',
  },
  {
    id: 'q14',
    before: 'Dat is ',
    focus: 'mijn broer',
    after: '.',
    question: 'Wie is dat?',
    accept: [],
    type: 'vraagwoord',
    hint: 'You are asking about a person.',
  },
  {
    id: 'q15',
    before: 'Ja, ',
    focus: 'ik woon in Utrecht',
    after: '.',
    question: 'Woon je in Utrecht?',
    accept: ['Woon jij in Utrecht?', 'Woont u in Utrecht?'],
    type: 'janee',
    hint: 'Start with the verb. Careful: after "je" the -t drops.',
  },
  {
    id: 'q16',
    before: 'Ja, ',
    focus: 'ik heb een afspraak',
    after: '.',
    question: 'Heb je een afspraak?',
    accept: ['Heb jij een afspraak?', 'Heeft u een afspraak?'],
    type: 'janee',
    hint: 'Start with the verb: "heb" with je/jij, "heeft" with u.',
  },
  {
    id: 'q17',
    before: 'Ja, ',
    focus: 'de dokter kan mij vandaag zien',
    after: '.',
    question: 'Kan de dokter mij vandaag zien?',
    accept: ['Kan de dokter me vandaag zien?'],
    type: 'janee',
    hint: 'Start with the finite verb, then the subject.',
  },
]
