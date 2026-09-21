export interface TaskPoint {
  label: string
  /** Word stems that suggest the point was addressed. A hint, not a grade. */
  keywords: string[]
}

export interface WritingTask {
  id: string
  title: string
  recipient: string
  register: 'formeel' | 'informeel'
  situation: string
  points: TaskPoint[]
  minSentences: number
  /** Suggested working time in minutes, like the exam's own pacing. */
  minutes: number
  model: string
}

/** The DUO criteria, ticked by the writer: the part no local check can do. */
export const RUBRIC = [
  'Every point from the brief is really covered, not just hinted at with one word.',
  'The opening and the closing fit this recipient.',
  'I use u everywhere (or je everywhere), never the two mixed.',
  'In every sentence the finite verb is in second position; after omdat/dat it is last.',
  'Verbs, plurals and tricky words are spelled correctly.',
  'Every sentence starts with a capital letter and ends with a full stop.',
]

export const tasks: WritingTask[] = [
  {
    id: 'e1',
    title: 'E-mail naar de school',
    recipient: 'De school van je dochter',
    register: 'formeel',
    situation:
      'Je dochter Leila is ziek en kan deze week niet naar school. Je schrijft een e-mail aan de school.',
    points: [
      { label: 'Zeg om welk kind het gaat', keywords: ['dochter', 'zoon', 'kind', 'leila'] },
      { label: 'Meld dat zij ziek is', keywords: ['ziek', 'griep', 'koorts'] },
      { label: 'Zeg hoelang zij wegblijft', keywords: ['week', 'dagen', 'dag', 'maandag', 'vrijdag', 'morgen'] },
      { label: 'Vraag om het huiswerk', keywords: ['huiswerk', 'opdracht', 'werk'] },
    ],
    minSentences: 5,
    minutes: 15,
    model: `Geachte heer/mevrouw,

Mijn dochter Leila zit in groep 5. Zij is sinds gisteren ziek en heeft koorts. Daarom kan zij deze week niet naar school komen.

Ik verwacht dat zij volgende week maandag weer beter is. Kunt u mij het huiswerk van deze week per e-mail sturen? Dan kan zij thuis een beetje bijwerken.

Met vriendelijke groet,
Anish Nalabanda`,
  },
  {
    id: 'e2',
    title: 'Bericht aan de buurvrouw',
    recipient: 'Anna, je buurvrouw',
    register: 'informeel',
    situation:
      'Je gaat een week op vakantie. Je schrijft een kort bericht aan je buurvrouw Anna, die je goed kent.',
    points: [
      { label: 'Vertel dat je op vakantie gaat', keywords: ['vakantie', 'weg', 'reis'] },
      { label: 'Vraag of zij de planten water geeft', keywords: ['planten', 'water', 'bloemen'] },
      { label: 'Zeg wanneer je terug bent', keywords: ['terug', 'zondag', 'week', 'maandag'] },
      { label: 'Bedank haar', keywords: ['bedankt', 'dank', 'fijn'] },
    ],
    minSentences: 4,
    minutes: 10,
    model: `Hoi Anna,

Volgende week ga ik een week op vakantie naar Spanje. Kun je in die week de planten water geven? Ze staan in de woonkamer en bij het raam.

Ik ben zondag 12 april weer terug. De sleutel breng ik donderdag even langs. Alvast heel erg bedankt!

Groetjes,
Anish`,
  },
  {
    id: 'e3',
    title: 'E-mail naar de verhuurder',
    recipient: 'De verhuurder van je woning',
    register: 'formeel',
    situation:
      'De verwarming in je woning is kapot. Het is koud in huis. Je schrijft een e-mail aan je verhuurder.',
    points: [
      { label: 'Zeg wat er kapot is', keywords: ['verwarming', 'kapot', 'stuk', 'koud'] },
      { label: 'Zeg sinds wanneer', keywords: ['sinds', 'maandag', 'week', 'dagen', 'gisteren'] },
      { label: 'Vraag om een monteur', keywords: ['monteur', 'repareren', 'maken', 'langskomen', 'oplossen'] },
      { label: 'Zeg wanneer je thuis bent', keywords: ['thuis', 'uur', 'avond', 'werkdagen', 'bellen'] },
    ],
    minSentences: 5,
    minutes: 15,
    model: `Geachte heer/mevrouw,

Ik woon op de Kerkstraat 12 in Utrecht. De verwarming in mijn woning is kapot. Sinds maandag wordt de radiator niet meer warm en is het koud in huis.

Kunt u zo snel mogelijk een monteur sturen? Op werkdagen ben ik na 17.00 uur thuis, en in het weekend de hele dag. U kunt mij ook bellen op 06-12345678.

Met vriendelijke groet,
Anish Nalabanda`,
  },
]

export type StemRule = 'bijzin' | 'inversie' | 'hoofdzin'

export interface SentenceStem {
  id: string
  /** The part that is given; the owner writes the rest. */
  stem: string
  rule: StemRule
  hint: string
  /** Model completions: more than one, so it is clear there is no single answer. */
  models: string[]
}

/** Level 1: finishing sentences, the bridge from tile-assembly to free writing. */
export const stems: SentenceStem[] = [
  {
    id: 's1',
    stem: 'Ik kan vrijdag niet komen, omdat',
    rule: 'bijzin',
    hint: 'After omdat the finite verb moves to the end of the clause.',
    models: ['ik die dag moet werken.', 'ik een afspraak bij de dokter heb.'],
  },
  {
    id: 's2',
    stem: 'Ik schrijf u deze e-mail omdat',
    rule: 'bijzin',
    hint: 'After omdat the verb goes last.',
    models: ['ik een vraag over mijn contract heb.', 'de verwarming al een week kapot is.'],
  },
  {
    id: 's3',
    stem: 'Als het morgen regent,',
    rule: 'inversie',
    hint: 'The sentence opens with a subordinate clause, so the main clause starts with the verb.',
    models: ['blijf ik thuis.', 'ga ik met de bus.'],
  },
  {
    id: 's4',
    stem: 'Ik ben vandaag niet op mijn werk, want',
    rule: 'hoofdzin',
    hint: 'After want the order stays normal: subject, then the finite verb.',
    models: ['ik ben ziek.', 'mijn dochter heeft koorts.'],
  },
  {
    id: 's5',
    stem: 'Kunt u mij laten weten of',
    rule: 'bijzin',
    hint: 'After of the finite verb moves to the end.',
    models: ['de afspraak doorgaat?', 'ik nog papieren mee moet nemen?'],
  },
  {
    id: 's6',
    stem: 'Morgen',
    rule: 'inversie',
    hint: 'The sentence opens with a time phrase, so the verb comes first and the subject after it.',
    models: ['ga ik naar de tandarts.', 'bel ik u weer.'],
  },
  {
    id: 's7',
    stem: 'Mijn dochter kan deze week niet naar school komen, omdat',
    rule: 'bijzin',
    hint: 'After omdat the finite verb goes last.',
    models: ['zij ziek is.', 'zij griep heeft.'],
  },
  {
    id: 's8',
    stem: 'Ik hoop dat',
    rule: 'bijzin',
    hint: 'After dat the verb moves to the end.',
    models: ['u mij snel kunt helpen.', 'het probleem deze week opgelost is.'],
  },
  {
    id: 's9',
    stem: 'Na het werk',
    rule: 'inversie',
    hint: 'If you start with a phrase, the verb comes next.',
    models: ['haal ik de kinderen op.', 'doe ik de boodschappen.'],
  },
  {
    id: 's10',
    stem: 'Ik wil graag een nieuwe afspraak maken, want',
    rule: 'hoofdzin',
    hint: 'After want the word order does not change.',
    models: ['ik moet die dag werken.', 'ik ben dan op vakantie.'],
  },
]
