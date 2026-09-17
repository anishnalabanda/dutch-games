export type VerbRule =
  | 'ik'
  | 'stam-t'
  | 'stam-t-al'
  | 'inversie-jij'
  | 'inversie-u'
  | 'meervoud'
  | 'onregelmatig'

export interface VerbItem {
  id: string
  /** Sentence with a single ___ where the conjugated verb goes. */
  sentence: string
  infinitive: string
  gloss: string
  options: string[]
  answer: string
  /** Other forms that are also correct (e.g. jij kunt / jij kan). */
  accept?: string[]
  rule: VerbRule
}

export const RULE_LABELS: Record<VerbRule, string> = {
  ik: 'Ik-vorm',
  'stam-t': 'Stam + t',
  'stam-t-al': 'Stam op -t',
  'inversie-jij': 'Inversie met jij',
  'inversie-u': 'Inversie met u',
  meervoud: 'Meervoud',
  onregelmatig: 'Onregelmatig',
}

export const RULE_EXPLANATIONS: Record<VerbRule, string> = {
  ik: 'Bij ik gebruik je de stam: het hele werkwoord zonder -en.',
  'stam-t': 'Bij jij, u, hij, zij en het komt er een -t achter de stam.',
  'stam-t-al': 'De stam eindigt al op een -t. Er komt dan geen tweede -t bij.',
  'inversie-jij':
    'Staat jij of je na het werkwoord? Dan valt de -t weg: "jij werkt", maar "werk jij?".',
  'inversie-u': 'Bij u blijft de -t altijd staan, ook in een vraag: "Spreekt u Nederlands?".',
  meervoud: 'Bij wij, jullie en zij (meervoud) gebruik je het hele werkwoord.',
  onregelmatig: 'Dit werkwoord is onregelmatig. Deze vormen leer je uit je hoofd.',
}

export const items: VerbItem[] = [
  {
    id: 'w1',
    sentence: 'Ik ___ bij een bakkerij.',
    infinitive: 'werken',
    gloss: 'to work',
    options: ['werk', 'werkt', 'werken'],
    answer: 'werk',
    rule: 'ik',
  },
  {
    id: 'w2',
    sentence: 'Jij ___ elke zaterdag.',
    infinitive: 'werken',
    gloss: 'to work',
    options: ['werk', 'werkt', 'werken'],
    answer: 'werkt',
    rule: 'stam-t',
  },
  {
    id: 'w3',
    sentence: '___ jij morgen?',
    infinitive: 'werken',
    gloss: 'to work',
    options: ['Werk', 'Werkt', 'Werken'],
    answer: 'Werk',
    rule: 'inversie-jij',
  },
  {
    id: 'w4',
    sentence: 'Hij ___ in Rotterdam.',
    infinitive: 'wonen',
    gloss: 'to live',
    options: ['woon', 'woont', 'wonen'],
    answer: 'woont',
    rule: 'stam-t',
  },
  {
    id: 'w5',
    sentence: 'Wij ___ samen in een flat.',
    infinitive: 'wonen',
    gloss: 'to live',
    options: ['woon', 'woont', 'wonen'],
    answer: 'wonen',
    rule: 'meervoud',
  },
  {
    id: 'w6',
    sentence: '___ u Nederlands?',
    infinitive: 'spreken',
    gloss: 'to speak',
    options: ['Spreek', 'Spreekt', 'Spreken'],
    answer: 'Spreekt',
    rule: 'inversie-u',
  },
  {
    id: 'w7',
    sentence: 'Mijn buurvrouw ___ goed Engels.',
    infinitive: 'spreken',
    gloss: 'to speak',
    options: ['spreek', 'spreekt', 'spreken'],
    answer: 'spreekt',
    rule: 'stam-t',
  },
  {
    id: 'w8',
    sentence: '___ jij tijd voor een kop koffie?',
    infinitive: 'hebben',
    gloss: 'to have',
    options: ['Heb', 'Hebt', 'Heeft'],
    answer: 'Heb',
    rule: 'inversie-jij',
  },
  {
    id: 'w9',
    sentence: 'Hij ___ twee kinderen.',
    infinitive: 'hebben',
    gloss: 'to have',
    options: ['heb', 'hebt', 'heeft'],
    answer: 'heeft',
    rule: 'onregelmatig',
  },
  {
    id: 'w10',
    sentence: 'Ik ___ vandaag ziek.',
    infinitive: 'zijn',
    gloss: 'to be',
    options: ['ben', 'bent', 'is'],
    answer: 'ben',
    rule: 'onregelmatig',
  },
  {
    id: 'w11',
    sentence: 'Jij ___ te laat voor de les.',
    infinitive: 'zijn',
    gloss: 'to be',
    options: ['ben', 'bent', 'is'],
    answer: 'bent',
    rule: 'onregelmatig',
  },
  {
    id: 'w12',
    sentence: '___ jij ziek?',
    infinitive: 'zijn',
    gloss: 'to be',
    options: ['Ben', 'Bent', 'Is'],
    answer: 'Ben',
    rule: 'inversie-jij',
  },
  {
    id: 'w13',
    sentence: 'Mijn zus ___ naar de dokter.',
    infinitive: 'gaan',
    gloss: 'to go',
    options: ['ga', 'gaat', 'gaan'],
    answer: 'gaat',
    rule: 'stam-t',
  },
  {
    id: 'w14',
    sentence: 'Jullie ___ met de bus.',
    infinitive: 'gaan',
    gloss: 'to go',
    options: ['ga', 'gaat', 'gaan'],
    answer: 'gaan',
    rule: 'meervoud',
  },
  {
    id: 'w15',
    sentence: 'Ik ___ meestal om zes uur.',
    infinitive: 'eten',
    gloss: 'to eat',
    options: ['eet', 'eett', 'eten'],
    answer: 'eet',
    rule: 'ik',
  },
  {
    id: 'w16',
    sentence: 'Jij ___ altijd brood.',
    infinitive: 'eten',
    gloss: 'to eat',
    options: ['eet', 'eett', 'eten'],
    answer: 'eet',
    rule: 'stam-t-al',
  },
  {
    id: 'w17',
    sentence: 'Hij ___ naast mij in de klas.',
    infinitive: 'zitten',
    gloss: 'to sit',
    options: ['zit', 'zitt', 'zitten'],
    answer: 'zit',
    rule: 'stam-t-al',
  },
  {
    id: 'w18',
    sentence: 'Ik ___ morgen langskomen.',
    infinitive: 'kunnen',
    gloss: 'can, to be able to',
    options: ['kan', 'kunt', 'kunnen'],
    answer: 'kan',
    rule: 'onregelmatig',
  },
  {
    id: 'w19',
    sentence: 'Jij ___ heel goed koken.',
    infinitive: 'kunnen',
    gloss: 'can, to be able to',
    options: ['kan', 'kunt', 'kunnen'],
    answer: 'kunt',
    accept: ['kan'],
    rule: 'onregelmatig',
  },
  {
    id: 'w20',
    sentence: 'Hij ___ vandaag overwerken.',
    infinitive: 'moeten',
    gloss: 'must, to have to',
    options: ['moet', 'moett', 'moeten'],
    answer: 'moet',
    rule: 'stam-t-al',
  },
  {
    id: 'w21',
    sentence: 'Ik ___ graag een afspraak maken.',
    infinitive: 'willen',
    gloss: 'to want',
    options: ['wil', 'wilt', 'willen'],
    answer: 'wil',
    rule: 'onregelmatig',
  },
  {
    id: 'w22',
    sentence: 'Wij ___ Nederlands op school.',
    infinitive: 'leren',
    gloss: 'to learn',
    options: ['leer', 'leert', 'leren'],
    answer: 'leren',
    rule: 'meervoud',
  },
  {
    id: 'w23',
    sentence: 'Mijn ouders ___ uit Polen.',
    infinitive: 'komen',
    gloss: 'to come',
    options: ['kom', 'komt', 'komen'],
    answer: 'komen',
    rule: 'meervoud',
  },
  {
    id: 'w24',
    sentence: 'Mijn zus ___ Sara.',
    infinitive: 'heten',
    gloss: 'to be called',
    options: ['heet', 'heett', 'heten'],
    answer: 'heet',
    rule: 'stam-t-al',
  },
  {
    id: 'w25',
    sentence: 'Ik ___ vanmiddag de boodschappen.',
    infinitive: 'doen',
    gloss: 'to do',
    options: ['doe', 'doet', 'doen'],
    answer: 'doe',
    rule: 'ik',
  },
]
