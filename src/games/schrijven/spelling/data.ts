export type SpellMode = 'meervoud' | 'ikvorm' | 'hijvorm' | 'inversie'
export type SpellRule =
  | 'verdubbel'
  | 'enkel-medeklinker'
  | 'lange-klank'
  | 'v-f'
  | 'z-s'
  | 'apostrof'
  | 's-meervoud'
  | 'onregelmatig'
  | 'dt'
  | 'dt-inversie'

export interface SpellItem {
  id: string
  /** Word that goes into the machine. */
  from: string
  /** Word that should come out. */
  to: string
  mode: SpellMode
  gloss: string
  rule: SpellRule
  /** Extra cue for verb forms, e.g. "hij" or "word jij?". */
  cue?: string
}

export const MODE_LABELS: Record<SpellMode, string> = {
  meervoud: 'singular → plural',
  ikvorm: 'infinitive → ik-form',
  hijvorm: 'infinitive → hij / jij',
  inversie: 'infinitive → question with jij',
}

export const RULE_LABELS: Record<SpellRule, string> = {
  verdubbel: 'Double the consonant',
  'enkel-medeklinker': 'Double consonant drops',
  'lange-klank': 'Long sound, one vowel',
  'v-f': 'v becomes f',
  'z-s': 'z becomes s',
  apostrof: "Plural with 's",
  's-meervoud': 'Plural with -s',
  onregelmatig: 'Irregular',
  dt: '-dt',
  'dt-inversie': 'Inversion',
}

export const RULE_EXPLANATIONS: Record<SpellRule, string> = {
  verdubbel:
    'A short sound in a closed syllable stays short: double the consonant when a syllable is added (man → mannen).',
  'enkel-medeklinker':
    'The other way round, the double consonant drops as soon as the syllable closes (zitten → ik zit).',
  'lange-klank':
    'A long sound in an open syllable is written with one vowel (boom → bomen, maken → ik maak).',
  'v-f': 'At the end of a syllable the v becomes an f (schrijven → ik schrijf, brief → brieven).',
  'z-s': 'At the end of a syllable the z becomes an s (lezen → ik lees, huis → huizen).',
  apostrof:
    "Does the word end in a lone a, i, o, u or y? Then the plural takes 's (foto → foto's).",
  's-meervoud': 'Words ending in -el, -em, -en, -er or -je take -s in the plural.',
  onregelmatig: 'This plural is irregular, so it has to be memorised.',
  dt: 'Stem + t. Does the stem already end in a d? Then you still write -dt: hij wordt, jij vindt.',
  'dt-inversie': 'Does jij come after the verb? Then the -t drops: jij wordt, but word jij?',
}

export const items: SpellItem[] = [
  { id: 's1', from: 'man', to: 'mannen', mode: 'meervoud', gloss: 'man', rule: 'verdubbel' },
  { id: 's2', from: 'kat', to: 'katten', mode: 'meervoud', gloss: 'cat', rule: 'verdubbel' },
  { id: 's3', from: 'bus', to: 'bussen', mode: 'meervoud', gloss: 'bus', rule: 'verdubbel' },
  { id: 's4', from: 'les', to: 'lessen', mode: 'meervoud', gloss: 'lesson', rule: 'verdubbel' },
  { id: 's5', from: 'boom', to: 'bomen', mode: 'meervoud', gloss: 'tree', rule: 'lange-klank' },
  { id: 's6', from: 'raam', to: 'ramen', mode: 'meervoud', gloss: 'window', rule: 'lange-klank' },
  { id: 's7', from: 'week', to: 'weken', mode: 'meervoud', gloss: 'week', rule: 'lange-klank' },
  { id: 's8', from: 'uur', to: 'uren', mode: 'meervoud', gloss: 'hour', rule: 'lange-klank' },
  { id: 's9', from: 'brief', to: 'brieven', mode: 'meervoud', gloss: 'letter', rule: 'v-f' },
  { id: 's10', from: 'huis', to: 'huizen', mode: 'meervoud', gloss: 'house', rule: 'z-s' },
  { id: 's11', from: 'prijs', to: 'prijzen', mode: 'meervoud', gloss: 'price', rule: 'z-s' },
  { id: 's12', from: 'foto', to: "foto's", mode: 'meervoud', gloss: 'photo', rule: 'apostrof' },
  { id: 's13', from: 'auto', to: "auto's", mode: 'meervoud', gloss: 'car', rule: 'apostrof' },
  { id: 's14', from: 'oma', to: "oma's", mode: 'meervoud', gloss: 'grandma', rule: 'apostrof' },
  { id: 's15', from: 'tafel', to: 'tafels', mode: 'meervoud', gloss: 'table', rule: 's-meervoud' },
  {
    id: 's16',
    from: 'sleutel',
    to: 'sleutels',
    mode: 'meervoud',
    gloss: 'key',
    rule: 's-meervoud',
  },
  { id: 's17', from: 'meisje', to: 'meisjes', mode: 'meervoud', gloss: 'girl', rule: 's-meervoud' },
  { id: 's18', from: 'kind', to: 'kinderen', mode: 'meervoud', gloss: 'child', rule: 'onregelmatig' },
  { id: 's19', from: 'ei', to: 'eieren', mode: 'meervoud', gloss: 'egg', rule: 'onregelmatig' },
  { id: 's20', from: 'stad', to: 'steden', mode: 'meervoud', gloss: 'city', rule: 'onregelmatig' },
  { id: 's21', from: 'maken', to: 'maak', mode: 'ikvorm', gloss: 'to make', rule: 'lange-klank' },
  { id: 's22', from: 'lopen', to: 'loop', mode: 'ikvorm', gloss: 'to walk', rule: 'lange-klank' },
  { id: 's23', from: 'wonen', to: 'woon', mode: 'ikvorm', gloss: 'to live', rule: 'lange-klank' },
  { id: 's24', from: 'schrijven', to: 'schrijf', mode: 'ikvorm', gloss: 'to write', rule: 'v-f' },
  { id: 's25', from: 'geven', to: 'geef', mode: 'ikvorm', gloss: 'to give', rule: 'v-f' },
  { id: 's26', from: 'lezen', to: 'lees', mode: 'ikvorm', gloss: 'to read', rule: 'z-s' },
  { id: 's27', from: 'reizen', to: 'reis', mode: 'ikvorm', gloss: 'to travel', rule: 'z-s' },
  {
    id: 's28',
    from: 'zitten',
    to: 'zit',
    mode: 'ikvorm',
    gloss: 'to sit',
    rule: 'enkel-medeklinker',
  },
  {
    id: 's29',
    from: 'bellen',
    to: 'bel',
    mode: 'ikvorm',
    gloss: 'to call',
    rule: 'enkel-medeklinker',
  },
  { id: 's30', from: 'worden', to: 'wordt', mode: 'hijvorm', gloss: 'to become', rule: 'dt', cue: 'hij' },
  { id: 's31', from: 'vinden', to: 'vindt', mode: 'hijvorm', gloss: 'to find', rule: 'dt', cue: 'jij' },
  { id: 's32', from: 'houden', to: 'houdt', mode: 'hijvorm', gloss: 'to hold, to like', rule: 'dt', cue: 'hij' },
  {
    id: 's33',
    from: 'antwoorden',
    to: 'antwoordt',
    mode: 'hijvorm',
    gloss: 'to answer',
    rule: 'dt',
    cue: 'hij',
  },
  {
    id: 's34',
    from: 'worden',
    to: 'word',
    mode: 'inversie',
    gloss: 'to become',
    rule: 'dt-inversie',
    cue: '___ jij?',
  },
  {
    id: 's35',
    from: 'vinden',
    to: 'vind',
    mode: 'inversie',
    gloss: 'to find',
    rule: 'dt-inversie',
    cue: '___ jij dat leuk?',
  },
]
