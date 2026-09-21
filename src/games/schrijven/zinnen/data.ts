export type RuleType = 'hoofdzin' | 'inversie' | 'bijzin-omdat' | 'modaal' | 'scheidbaar'

export interface WordSpec {
  text: string
  gloss: string
  isVerb?: boolean
}

export interface ZinSentence {
  id: string
  rule: RuleType
  prompt: string
  /** The infinitive, shown for the rules where the whole verb is the point. */
  hint?: string
  words: WordSpec[]
}

export const RULE_LABELS: Record<RuleType, string> = {
  hoofdzin: 'Main clause',
  inversie: 'Inversion',
  'bijzin-omdat': 'Omdat clause',
  modaal: 'Modal verb',
  scheidbaar: 'Separable verb',
}

export const RULE_EXPLANATIONS: Record<RuleType, string> = {
  hoofdzin: 'In a main clause the finite verb (the conjugated verb) goes in second position.',
  inversie:
    'Does the sentence start with a time or place phrase? Then the order flips: verb before the subject.',
  'bijzin-omdat': 'After "omdat" the conjugated verb moves to the end of the sentence.',
  modaal:
    'After a modal verb (kunnen, moeten, willen, mogen) the second verb goes to the end as an infinitive.',
  scheidbaar:
    'A separable verb splits in a main clause: the conjugated part sits in position 2, the prefix goes to the end.',
}

export const RULE_SUCCESS: Record<RuleType, string> = {
  hoofdzin: 'The finite verb is in second position.',
  inversie: 'After the phrase at the front comes the verb first, then the subject.',
  'bijzin-omdat': 'The verb is at the end, after "omdat".',
  modaal: 'The infinitive is right at the end.',
  scheidbaar: 'The detached part of the verb is at the end.',
}

/**
 * One extra sentence shown when the answer was right. It does not restate the
 * rule, it generalises it, so a correct answer still teaches something.
 */
export const RULE_NOTES: Record<RuleType, string> = {
  hoofdzin: 'Slot 1 holds one chunk of meaning, however many words that takes.',
  inversie: 'The verb never leaves slot 2, so it is the subject that gets pushed back.',
  'bijzin-omdat': 'Dat, als and terwijl send the verb to the end in the same way.',
  modaal: 'Only the modal changes form. The second verb stays whole.',
  scheidbaar: 'Look the verb up as one word (opbellen), then split it to use it.',
}

export interface RuleSlot {
  /** The example words filling this slot. */
  text: string
  /** What the slot is for, in English. */
  role: string
  /** Verb slots are coloured, so the frame of the sentence stands out. */
  isVerb?: boolean
}

/**
 * One worked example per rule, cut into its slots. A slot is a chunk of meaning,
 * not a word: "De dokter" is two words but one slot, which is why the verb after
 * it still counts as second.
 */
export const RULE_PATTERNS: Record<RuleType, RuleSlot[]> = {
  hoofdzin: [
    { text: 'De dokter', role: 'subject' },
    { text: 'belt', role: 'verb, always slot 2', isVerb: true },
    { text: 'vanmiddag.', role: 'the rest' },
  ],
  inversie: [
    { text: 'Op maandag', role: 'time or place' },
    { text: 'werk', role: 'verb, still slot 2', isVerb: true },
    { text: 'ik', role: 'subject, pushed back' },
    { text: 'niet.', role: 'the rest' },
  ],
  'bijzin-omdat': [
    { text: 'Ik blijf thuis', role: 'main clause' },
    { text: 'omdat', role: 'sends the verb away' },
    { text: 'ik ziek', role: 'the rest' },
    { text: 'ben.', role: 'verb, right at the end', isVerb: true },
  ],
  modaal: [
    { text: 'U', role: 'subject' },
    { text: 'moet', role: 'modal verb, slot 2', isVerb: true },
    { text: 'dit formulier', role: 'the rest' },
    { text: 'invullen.', role: 'infinitive, at the end', isVerb: true },
  ],
  scheidbaar: [
    { text: 'Ik', role: 'subject' },
    { text: 'bel', role: 'verb, slot 2', isVerb: true },
    { text: 'u morgen', role: 'the rest' },
    { text: 'op.', role: 'prefix, at the end', isVerb: true },
  ],
}

export interface RuleExample {
  /** The whole verb or the trigger word the example is built from. */
  from?: string
  sentence: string
  /** The words the rule is actually about, coloured so the parts are visible. */
  mark: string[]
}

/**
 * Several worked instances per rule, so the grammar words in the explanation
 * ("the conjugated part", "the prefix") can be matched to something concrete and
 * applied to a verb the game has not shown yet.
 */
export const RULE_EXAMPLES: Record<RuleType, RuleExample[]> = {
  hoofdzin: [
    { sentence: 'Ik werk in Amsterdam.', mark: ['werk'] },
    { sentence: 'Mijn zus woont in Utrecht.', mark: ['woont'] },
    { sentence: 'De nieuwe buurman komt vanavond.', mark: ['komt'] },
  ],
  inversie: [
    { from: 'Vandaag', sentence: 'Vandaag ga ik naar de dokter.', mark: ['ga'] },
    { from: 'Om negen uur', sentence: 'Om negen uur begint de les.', mark: ['begint'] },
    { from: 'In Utrecht', sentence: 'In Utrecht woont mijn zus.', mark: ['woont'] },
  ],
  'bijzin-omdat': [
    { from: 'omdat', sentence: 'Ik blijf thuis omdat ik ziek ben.', mark: ['ben'] },
    { from: 'dat', sentence: 'Ik denk dat het vandaag regent.', mark: ['regent'] },
    { from: 'als', sentence: 'Ik bel je als ik klaar ben.', mark: ['ben'] },
  ],
  modaal: [
    { from: 'kunnen', sentence: 'Ik kan vandaag niet komen.', mark: ['kan', 'komen'] },
    { from: 'moeten', sentence: 'Je moet dit formulier invullen.', mark: ['moet', 'invullen'] },
    { from: 'willen', sentence: 'Wij willen graag helpen.', mark: ['willen', 'helpen'] },
    { from: 'mogen', sentence: 'U mag hier niet roken.', mark: ['mag', 'roken'] },
  ],
  scheidbaar: [
    { from: 'opbellen', sentence: 'Ik bel je morgen op.', mark: ['bel', 'op'] },
    { from: 'meenemen', sentence: 'Zij neemt haar zoon mee.', mark: ['neemt', 'mee'] },
    { from: 'invullen', sentence: 'U vult het formulier in.', mark: ['vult', 'in'] },
    { from: 'opstaan', sentence: 'Wij staan om zeven uur op.', mark: ['staan', 'op'] },
  ],
}

export const sentences: ZinSentence[] = [
  // --- Main clause: finite verb in position 2 ---
  {
    id: 'hz1',
    rule: 'hoofdzin',
    prompt: 'I go to the store.',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'ga', gloss: 'go', isVerb: true },
      { text: 'naar', gloss: 'to' },
      { text: 'de', gloss: 'the' },
      { text: 'winkel.', gloss: 'store' },
    ],
  },
  {
    id: 'hz2',
    rule: 'hoofdzin',
    prompt: 'He works in Amsterdam.',
    words: [
      { text: 'Hij', gloss: 'he' },
      { text: 'werkt', gloss: 'works', isVerb: true },
      { text: 'in', gloss: 'in' },
      { text: 'Amsterdam.', gloss: 'Amsterdam' },
    ],
  },
  {
    id: 'hz3',
    rule: 'hoofdzin',
    prompt: 'We live in Utrecht.',
    words: [
      { text: 'Wij', gloss: 'we' },
      { text: 'wonen', gloss: 'live', isVerb: true },
      { text: 'in', gloss: 'in' },
      { text: 'Utrecht.', gloss: 'Utrecht' },
    ],
  },
  {
    id: 'hz4',
    rule: 'hoofdzin',
    prompt: 'She drinks coffee with her neighbour.',
    words: [
      { text: 'Zij', gloss: 'she' },
      { text: 'drinkt', gloss: 'drinks', isVerb: true },
      { text: 'koffie', gloss: 'coffee' },
      { text: 'met', gloss: 'with' },
      { text: 'haar', gloss: 'her' },
      { text: 'buurvrouw.', gloss: 'neighbour (f.)' },
    ],
  },
  {
    id: 'hz5',
    rule: 'hoofdzin',
    prompt: 'My son plays outside.',
    words: [
      { text: 'Mijn', gloss: 'my' },
      { text: 'zoon', gloss: 'son' },
      { text: 'speelt', gloss: 'plays', isVerb: true },
      { text: 'buiten.', gloss: 'outside' },
    ],
  },
  {
    id: 'hz6',
    rule: 'hoofdzin',
    prompt: 'I speak a little Dutch.',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'spreek', gloss: 'speak', isVerb: true },
      { text: 'een', gloss: 'a' },
      { text: 'beetje', gloss: 'a bit' },
      { text: 'Nederlands.', gloss: 'Dutch' },
    ],
  },
  {
    id: 'hz7',
    rule: 'hoofdzin',
    prompt: 'The child eats a sandwich.',
    words: [
      { text: 'Het', gloss: 'the' },
      { text: 'kind', gloss: 'child' },
      { text: 'eet', gloss: 'eats', isVerb: true },
      { text: 'een', gloss: 'a' },
      { text: 'boterham.', gloss: 'sandwich' },
    ],
  },
  {
    id: 'hz8',
    rule: 'hoofdzin',
    prompt: 'We pay by debit card.',
    words: [
      { text: 'Wij', gloss: 'we' },
      { text: 'betalen', gloss: 'pay', isVerb: true },
      { text: 'met', gloss: 'with' },
      { text: 'de', gloss: 'the' },
      { text: 'pinpas.', gloss: 'debit card' },
    ],
  },
  {
    id: 'hz9',
    rule: 'hoofdzin',
    prompt: 'The doctor calls this afternoon.',
    words: [
      { text: 'De', gloss: 'the' },
      { text: 'dokter', gloss: 'doctor' },
      { text: 'belt', gloss: 'calls', isVerb: true },
      { text: 'vanmiddag.', gloss: 'this afternoon' },
    ],
  },

  // --- Inversion: phrase at the front, then the verb, then the subject ---
  {
    id: 'iv1',
    rule: 'inversie',
    prompt: 'Tomorrow I am going to the doctor.',
    words: [
      { text: 'Morgen', gloss: 'tomorrow' },
      { text: 'ga', gloss: 'go', isVerb: true },
      { text: 'ik', gloss: 'I' },
      { text: 'naar', gloss: 'to' },
      { text: 'de', gloss: 'the' },
      { text: 'dokter.', gloss: 'doctor' },
    ],
  },
  {
    id: 'iv2',
    rule: 'inversie',
    prompt: 'Today I am staying home.',
    words: [
      { text: 'Vandaag', gloss: 'today' },
      { text: 'blijf', gloss: 'stay', isVerb: true },
      { text: 'ik', gloss: 'I' },
      { text: 'thuis.', gloss: 'at home' },
    ],
  },
  {
    id: 'iv3',
    rule: 'inversie',
    prompt: 'On Monday I do not work.',
    words: [
      { text: 'Op', gloss: 'on' },
      { text: 'maandag', gloss: 'Monday' },
      { text: 'werk', gloss: 'work', isVerb: true },
      { text: 'ik', gloss: 'I' },
      { text: 'niet.', gloss: 'not' },
    ],
  },
  {
    id: 'iv4',
    rule: 'inversie',
    prompt: 'In the Netherlands it often rains.',
    words: [
      { text: 'In', gloss: 'in' },
      { text: 'Nederland', gloss: 'the Netherlands' },
      { text: 'regent', gloss: 'rains', isVerb: true },
      { text: 'het', gloss: 'it' },
      { text: 'vaak.', gloss: 'often' },
    ],
  },
  {
    id: 'iv5',
    rule: 'inversie',
    prompt: 'Next week we have an appointment.',
    words: [
      { text: 'Volgende', gloss: 'next' },
      { text: 'week', gloss: 'week' },
      { text: 'hebben', gloss: 'have', isVerb: true },
      { text: 'wij', gloss: 'we' },
      { text: 'een', gloss: 'an' },
      { text: 'afspraak.', gloss: 'appointment' },
    ],
  },
  {
    id: 'iv6',
    rule: 'inversie',
    prompt: 'After work I cook dinner.',
    words: [
      { text: 'Na', gloss: 'after' },
      { text: 'het', gloss: 'the' },
      { text: 'werk', gloss: 'work' },
      { text: 'kook', gloss: 'cook', isVerb: true },
      { text: 'ik', gloss: 'I' },
      { text: 'eten.', gloss: 'food …' },
    ],
  },
  {
    id: 'iv7',
    rule: 'inversie',
    prompt: 'In January we are moving to Rotterdam.',
    words: [
      { text: 'In', gloss: 'in' },
      { text: 'januari', gloss: 'January' },
      { text: 'verhuizen', gloss: 'move house', isVerb: true },
      { text: 'wij', gloss: 'we' },
      { text: 'naar', gloss: 'to' },
      { text: 'Rotterdam.', gloss: 'Rotterdam' },
    ],
  },
  {
    id: 'iv8',
    rule: 'inversie',
    prompt: 'Every day I take my daughter to school.',
    words: [
      { text: 'Elke', gloss: 'every' },
      { text: 'dag', gloss: 'day' },
      { text: 'breng', gloss: 'bring …', isVerb: true },
      { text: 'ik', gloss: 'I' },
      { text: 'mijn', gloss: 'my' },
      { text: 'dochter', gloss: 'daughter' },
      { text: 'naar', gloss: 'to' },
      { text: 'school.', gloss: 'school' },
    ],
  },
  {
    id: 'iv9',
    rule: 'inversie',
    prompt: 'At nine o’clock my work starts.',
    words: [
      { text: 'Om', gloss: 'at' },
      { text: 'negen', gloss: 'nine' },
      { text: 'uur', gloss: "o'clock" },
      { text: 'begint', gloss: 'starts', isVerb: true },
      { text: 'mijn', gloss: 'my' },
      { text: 'werk.', gloss: 'work' },
    ],
  },

  // --- Omdat clause: verb moves to the end ---
  {
    id: 'om1',
    rule: 'bijzin-omdat',
    prompt: 'I am not coming because I am ill.',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'kom', gloss: 'come', isVerb: true },
      { text: 'niet', gloss: 'not' },
      { text: 'omdat', gloss: 'because' },
      { text: 'ik', gloss: 'I' },
      { text: 'ziek', gloss: 'ill' },
      { text: 'ben.', gloss: 'am', isVerb: true },
    ],
  },
  {
    id: 'om2',
    rule: 'bijzin-omdat',
    prompt: 'She stays home because her child has a fever.',
    words: [
      { text: 'Zij', gloss: 'she' },
      { text: 'blijft', gloss: 'stays', isVerb: true },
      { text: 'thuis', gloss: 'at home' },
      { text: 'omdat', gloss: 'because' },
      { text: 'haar', gloss: 'her' },
      { text: 'kind', gloss: 'child' },
      { text: 'koorts', gloss: 'fever' },
      { text: 'heeft.', gloss: 'has', isVerb: true },
    ],
  },
  {
    id: 'om3',
    rule: 'bijzin-omdat',
    prompt: 'We go by train because the car is broken.',
    words: [
      { text: 'Wij', gloss: 'we' },
      { text: 'gaan', gloss: 'go', isVerb: true },
      { text: 'met', gloss: 'by' },
      { text: 'de', gloss: 'the' },
      { text: 'trein', gloss: 'train' },
      { text: 'omdat', gloss: 'because' },
      { text: 'de', gloss: 'the' },
      { text: 'auto', gloss: 'car' },
      { text: 'kapot', gloss: 'broken' },
      { text: 'is.', gloss: 'is', isVerb: true },
    ],
  },
  {
    id: 'om4',
    rule: 'bijzin-omdat',
    prompt: 'He is learning Dutch because he works here.',
    words: [
      { text: 'Hij', gloss: 'he' },
      { text: 'leert', gloss: 'learns', isVerb: true },
      { text: 'Nederlands', gloss: 'Dutch' },
      { text: 'omdat', gloss: 'because' },
      { text: 'hij', gloss: 'he' },
      { text: 'hier', gloss: 'here' },
      { text: 'werkt.', gloss: 'works', isVerb: true },
    ],
  },
  {
    id: 'om5',
    rule: 'bijzin-omdat',
    prompt: 'I am calling the doctor because I am in pain.',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'bel', gloss: 'call', isVerb: true },
      { text: 'de', gloss: 'the' },
      { text: 'dokter', gloss: 'doctor' },
      { text: 'omdat', gloss: 'because' },
      { text: 'ik', gloss: 'I' },
      { text: 'pijn', gloss: 'pain' },
      { text: 'heb.', gloss: 'have', isVerb: true },
    ],
  },
  {
    id: 'om6',
    rule: 'bijzin-omdat',
    prompt: 'He is coming later because the bus is late.',
    words: [
      { text: 'Hij', gloss: 'he' },
      { text: 'komt', gloss: 'comes', isVerb: true },
      { text: 'later', gloss: 'later' },
      { text: 'omdat', gloss: 'because' },
      { text: 'de', gloss: 'the' },
      { text: 'bus', gloss: 'bus' },
      { text: 'te', gloss: 'too' },
      { text: 'laat', gloss: 'late' },
      { text: 'is.', gloss: 'is', isVerb: true },
    ],
  },
  {
    id: 'om7',
    rule: 'bijzin-omdat',
    prompt: 'She is happy because she has a job.',
    words: [
      { text: 'Zij', gloss: 'she' },
      { text: 'is', gloss: 'is', isVerb: true },
      { text: 'blij', gloss: 'happy' },
      { text: 'omdat', gloss: 'because' },
      { text: 'zij', gloss: 'she' },
      { text: 'een', gloss: 'a' },
      { text: 'baan', gloss: 'job' },
      { text: 'heeft.', gloss: 'has', isVerb: true },
    ],
  },
  {
    id: 'om8',
    rule: 'bijzin-omdat',
    prompt: 'I am writing a letter because I have a complaint.',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'schrijf', gloss: 'write', isVerb: true },
      { text: 'een', gloss: 'a' },
      { text: 'brief', gloss: 'letter' },
      { text: 'omdat', gloss: 'because' },
      { text: 'ik', gloss: 'I' },
      { text: 'een', gloss: 'a' },
      { text: 'klacht', gloss: 'complaint' },
      { text: 'heb.', gloss: 'have', isVerb: true },
    ],
  },
  {
    id: 'om9',
    rule: 'bijzin-omdat',
    prompt: 'We eat late because I work long hours.',
    words: [
      { text: 'We', gloss: 'we' },
      { text: 'eten', gloss: 'eat', isVerb: true },
      { text: 'laat', gloss: 'late' },
      { text: 'omdat', gloss: 'because' },
      { text: 'ik', gloss: 'I' },
      { text: 'lang', gloss: 'long' },
      { text: 'werk.', gloss: 'work', isVerb: true },
    ],
  },

  // --- Modal: second verb goes to the end as an infinitive ---
  {
    id: 'md1',
    rule: 'modaal',
    prompt: 'I cannot come tomorrow.',
    hint: 'kunnen + komen',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'kan', gloss: 'can', isVerb: true },
      { text: 'morgen', gloss: 'tomorrow' },
      { text: 'niet', gloss: 'not' },
      { text: 'komen.', gloss: 'to come', isVerb: true },
    ],
  },
  {
    id: 'md2',
    rule: 'modaal',
    prompt: 'You must fill in this form. (formal)',
    hint: 'moeten + invullen',
    words: [
      { text: 'U', gloss: 'you (formal)' },
      { text: 'moet', gloss: 'must', isVerb: true },
      { text: 'dit', gloss: 'this' },
      { text: 'formulier', gloss: 'form' },
      { text: 'invullen.', gloss: 'to fill in', isVerb: true },
    ],
  },
  {
    id: 'md3',
    rule: 'modaal',
    prompt: 'We would like to make an appointment.',
    hint: 'willen + maken',
    words: [
      { text: 'Wij', gloss: 'we' },
      { text: 'willen', gloss: 'want', isVerb: true },
      { text: 'graag', gloss: 'gladly …' },
      { text: 'een', gloss: 'an' },
      { text: 'afspraak', gloss: 'appointment' },
      { text: 'maken.', gloss: 'to make', isVerb: true },
    ],
  },
  {
    id: 'md4',
    rule: 'modaal',
    prompt: 'She has to go to the council today.',
    hint: 'moeten + gaan',
    words: [
      { text: 'Zij', gloss: 'she' },
      { text: 'moet', gloss: 'must', isVerb: true },
      { text: 'vandaag', gloss: 'today' },
      { text: 'naar', gloss: 'to' },
      { text: 'de', gloss: 'the' },
      { text: 'gemeente', gloss: 'council' },
      { text: 'gaan.', gloss: 'to go', isVerb: true },
    ],
  },
  {
    id: 'md5',
    rule: 'modaal',
    prompt: 'I would like to speak to the doctor.',
    hint: 'willen + spreken',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'wil', gloss: 'want', isVerb: true },
      { text: 'graag', gloss: 'gladly …' },
      { text: 'met', gloss: 'with' },
      { text: 'de', gloss: 'the' },
      { text: 'dokter', gloss: 'doctor' },
      { text: 'spreken.', gloss: 'to speak', isVerb: true },
    ],
  },
  {
    id: 'md6',
    rule: 'modaal',
    prompt: 'You are not allowed to smoke here.',
    hint: 'mogen + roken',
    words: [
      { text: 'Je', gloss: 'you' },
      { text: 'mag', gloss: 'may', isVerb: true },
      { text: 'hier', gloss: 'here' },
      { text: 'niet', gloss: 'not' },
      { text: 'roken.', gloss: 'to smoke', isVerb: true },
    ],
  },
  {
    id: 'md7',
    rule: 'modaal',
    prompt: 'He can speak Dutch well.',
    hint: 'kunnen + spreken',
    words: [
      { text: 'Hij', gloss: 'he' },
      { text: 'kan', gloss: 'can', isVerb: true },
      { text: 'goed', gloss: 'well' },
      { text: 'Nederlands', gloss: 'Dutch' },
      { text: 'spreken.', gloss: 'to speak', isVerb: true },
    ],
  },
  {
    id: 'md8',
    rule: 'modaal',
    prompt: 'We have to pay the bill today.',
    hint: 'moeten + betalen',
    words: [
      { text: 'Wij', gloss: 'we' },
      { text: 'moeten', gloss: 'must', isVerb: true },
      { text: 'de', gloss: 'the' },
      { text: 'rekening', gloss: 'bill' },
      { text: 'vandaag', gloss: 'today' },
      { text: 'betalen.', gloss: 'to pay', isVerb: true },
    ],
  },
  {
    id: 'md9',
    rule: 'modaal',
    prompt: 'I have to get up early tomorrow.',
    hint: 'moeten + opstaan',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'moet', gloss: 'must', isVerb: true },
      { text: 'morgen', gloss: 'tomorrow' },
      { text: 'vroeg', gloss: 'early' },
      { text: 'opstaan.', gloss: 'to get up', isVerb: true },
    ],
  },

  // --- Separable: the detached part goes to the end ---
  {
    id: 'sb1',
    rule: 'scheidbaar',
    prompt: 'I will call you tomorrow. (formal)',
    hint: 'opbellen',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'bel', gloss: 'call', isVerb: true },
      { text: 'u', gloss: 'you (formal)' },
      { text: 'morgen', gloss: 'tomorrow' },
      { text: 'op.', gloss: 'up (part of opbellen)', isVerb: true },
    ],
  },
  {
    id: 'sb2',
    rule: 'scheidbaar',
    prompt: 'She brings her son along.',
    hint: 'meenemen',
    words: [
      { text: 'Zij', gloss: 'she' },
      { text: 'neemt', gloss: 'takes', isVerb: true },
      { text: 'haar', gloss: 'her' },
      { text: 'zoon', gloss: 'son' },
      { text: 'mee.', gloss: 'along (part of meenemen)', isVerb: true },
    ],
  },
  {
    id: 'sb3',
    rule: 'scheidbaar',
    prompt: 'We are cancelling the appointment.',
    hint: 'afzeggen',
    words: [
      { text: 'Wij', gloss: 'we' },
      { text: 'zeggen', gloss: 'say', isVerb: true },
      { text: 'de', gloss: 'the' },
      { text: 'afspraak', gloss: 'appointment' },
      { text: 'af.', gloss: 'off (part of afzeggen)', isVerb: true },
    ],
  },
  {
    id: 'sb4',
    rule: 'scheidbaar',
    prompt: 'He fills in the form.',
    hint: 'invullen',
    words: [
      { text: 'Hij', gloss: 'he' },
      { text: 'vult', gloss: 'fills', isVerb: true },
      { text: 'het', gloss: 'the' },
      { text: 'formulier', gloss: 'form' },
      { text: 'in.', gloss: 'in (part of invullen)', isVerb: true },
    ],
  },
  {
    id: 'sb5',
    rule: 'scheidbaar',
    prompt: 'The train arrives at eight o’clock.',
    hint: 'aankomen',
    words: [
      { text: 'De', gloss: 'the' },
      { text: 'trein', gloss: 'train' },
      { text: 'komt', gloss: 'comes', isVerb: true },
      { text: 'om', gloss: 'at' },
      { text: 'acht', gloss: 'eight' },
      { text: 'uur', gloss: "o'clock" },
      { text: 'aan.', gloss: 'at (part of aankomen)', isVerb: true },
    ],
  },
  {
    id: 'sb6',
    rule: 'scheidbaar',
    prompt: 'I get up at seven every day.',
    hint: 'opstaan',
    words: [
      { text: 'Ik', gloss: 'I' },
      { text: 'sta', gloss: 'stand', isVerb: true },
      { text: 'elke', gloss: 'every' },
      { text: 'dag', gloss: 'day' },
      { text: 'om', gloss: 'at' },
      { text: 'zeven', gloss: 'seven' },
      { text: 'uur', gloss: "o'clock" },
      { text: 'op.', gloss: 'up (part of opstaan)', isVerb: true },
    ],
  },
  {
    id: 'sb7',
    rule: 'scheidbaar',
    prompt: 'She tidies up the kitchen.',
    hint: 'opruimen',
    words: [
      { text: 'Zij', gloss: 'she' },
      { text: 'ruimt', gloss: 'clears', isVerb: true },
      { text: 'de', gloss: 'the' },
      { text: 'keuken', gloss: 'kitchen' },
      { text: 'op.', gloss: 'up (part of opruimen)', isVerb: true },
    ],
  },
  {
    id: 'sb8',
    rule: 'scheidbaar',
    prompt: 'We are going out tonight.',
    hint: 'uitgaan',
    words: [
      { text: 'Wij', gloss: 'we' },
      { text: 'gaan', gloss: 'go', isVerb: true },
      { text: 'vanavond', gloss: 'tonight' },
      { text: 'uit.', gloss: 'out (part of uitgaan)', isVerb: true },
    ],
  },
  {
    id: 'sb9',
    rule: 'scheidbaar',
    prompt: 'He closes the door.',
    hint: 'dichtdoen',
    words: [
      { text: 'Hij', gloss: 'he' },
      { text: 'doet', gloss: 'does', isVerb: true },
      { text: 'de', gloss: 'the' },
      { text: 'deur', gloss: 'door' },
      { text: 'dicht.', gloss: 'shut (part of dichtdoen)', isVerb: true },
    ],
  },
]
