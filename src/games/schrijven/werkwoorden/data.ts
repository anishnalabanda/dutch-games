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
  ik: 'Ik-form',
  'stam-t': 'Stem + t',
  'stam-t-al': 'Stem already ends in -t',
  'inversie-jij': 'Inversion with jij',
  'inversie-u': 'Inversion with u',
  meervoud: 'Plural',
  onregelmatig: 'Irregular',
}

export const RULE_EXPLANATIONS: Record<VerbRule, string> = {
  ik: 'With ik you use the stem: the infinitive without -en.',
  'stam-t': 'With jij, u, hij, zij and het a -t is added to the stem.',
  'stam-t-al': 'The stem already ends in -t, so no second -t is added.',
  'inversie-jij':
    'Does jij or je come after the verb? Then the -t drops: "jij werkt", but "werk jij?".',
  'inversie-u': 'With u the -t always stays, in a question too: "Spreekt u Nederlands?".',
  meervoud: 'With wij, jullie and zij (plural) you use the infinitive.',
  onregelmatig: 'This verb is irregular, so these forms have to be memorised.',
}

/**
 * Every present-tense form of one verb, shown once the answer is right: the
 * item only asks for one form, and the other five are what make it a rule
 * rather than a fact. `vraag` is the jij-form with the verb in front, where the
 * -t drops, which is the form the exam catches people out with.
 */
export interface Conjugation {
  ik: string
  jij: string
  u: string
  hij: string
  meervoud: string
  vraag: string
  /** What is worth noticing about this verb, in English. */
  note: string
}

export type FormKey = 'ik' | 'jij' | 'u' | 'hij' | 'meervoud'

/** The pronouns down the side of the table, with what each one is in English. */
export const FORM_ROWS: { key: FormKey; pronoun: string; role: string }[] = [
  { key: 'ik', pronoun: 'ik', role: 'I' },
  { key: 'jij', pronoun: 'jij / je', role: 'you, informal' },
  { key: 'u', pronoun: 'u', role: 'you, formal' },
  { key: 'hij', pronoun: 'hij / zij / het', role: 'he / she / it' },
  { key: 'meervoud', pronoun: 'wij / jullie / zij', role: 'we / you plural / they' },
]

export const CONJUGATIONS: Record<string, Conjugation> = {
  werken: {
    ik: 'werk',
    jij: 'werkt',
    u: 'werkt',
    hij: 'werkt',
    meervoud: 'werken',
    vraag: 'werk jij?',
    note: 'Regular: stem werk, plus -t for everyone except ik and the plural.',
  },
  wonen: {
    ik: 'woon',
    jij: 'woont',
    u: 'woont',
    hij: 'woont',
    meervoud: 'wonen',
    vraag: 'woon jij?',
    note: 'The stem doubles the vowel to keep the long sound: wonen becomes woon.',
  },
  spreken: {
    ik: 'spreek',
    jij: 'spreekt',
    u: 'spreekt',
    hij: 'spreekt',
    meervoud: 'spreken',
    vraag: 'spreek jij?',
    note: 'The stem doubles the vowel to keep the long sound: spreken becomes spreek.',
  },
  hebben: {
    ik: 'heb',
    jij: 'hebt',
    u: 'hebt',
    hij: 'heeft',
    meervoud: 'hebben',
    vraag: 'heb jij?',
    note: 'Irregular: hij, zij and het take heeft, not hebt. "U heeft" is also heard.',
  },
  zijn: {
    ik: 'ben',
    jij: 'bent',
    u: 'bent',
    hij: 'is',
    meervoud: 'zijn',
    vraag: 'ben jij?',
    note: 'Fully irregular, and the most used verb in the exam: learn all six by heart.',
  },
  gaan: {
    ik: 'ga',
    jij: 'gaat',
    u: 'gaat',
    hij: 'gaat',
    meervoud: 'gaan',
    vraag: 'ga jij?',
    note: 'The stem is ga, with one a; the -t forms write it as gaat.',
  },
  eten: {
    ik: 'eet',
    jij: 'eet',
    u: 'eet',
    hij: 'eet',
    meervoud: 'eten',
    vraag: 'eet jij?',
    note: 'The stem eet already ends in -t, so four of the forms look the same.',
  },
  zitten: {
    ik: 'zit',
    jij: 'zit',
    u: 'zit',
    hij: 'zit',
    meervoud: 'zitten',
    vraag: 'zit jij?',
    note: 'The stem zit already ends in -t, and the double t returns in the plural.',
  },
  kunnen: {
    ik: 'kan',
    jij: 'kunt',
    u: 'kunt',
    hij: 'kan',
    meervoud: 'kunnen',
    vraag: 'kun jij?',
    note: 'Irregular: ik and hij take kan, jij and u take kunt. "Jij kan" is accepted too.',
  },
  moeten: {
    ik: 'moet',
    jij: 'moet',
    u: 'moet',
    hij: 'moet',
    meervoud: 'moeten',
    vraag: 'moet jij?',
    note: 'The stem moet already ends in -t, so every singular form is moet.',
  },
  willen: {
    ik: 'wil',
    jij: 'wilt',
    u: 'wilt',
    hij: 'wil',
    meervoud: 'willen',
    vraag: 'wil jij?',
    note: 'Irregular: ik and hij take wil, jij and u take wilt. "Jij wil" is accepted too.',
  },
  leren: {
    ik: 'leer',
    jij: 'leert',
    u: 'leert',
    hij: 'leert',
    meervoud: 'leren',
    vraag: 'leer jij?',
    note: 'The stem doubles the vowel to keep the long sound: leren becomes leer.',
  },
  komen: {
    ik: 'kom',
    jij: 'komt',
    u: 'komt',
    hij: 'komt',
    meervoud: 'komen',
    vraag: 'kom jij?',
    note: 'The stem is kom with a short o, even though komen sounds long.',
  },
  heten: {
    ik: 'heet',
    jij: 'heet',
    u: 'heet',
    hij: 'heet',
    meervoud: 'heten',
    vraag: 'heet jij?',
    note: 'The stem heet already ends in -t, so no second -t is ever added.',
  },
  doen: {
    ik: 'doe',
    jij: 'doet',
    u: 'doet',
    hij: 'doet',
    meervoud: 'doen',
    vraag: 'doe jij?',
    note: 'The stem is doe, so the -t forms are doet and the plural stays doen.',
  },
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
