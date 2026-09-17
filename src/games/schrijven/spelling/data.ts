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
  meervoud: 'enkelvoud → meervoud',
  ikvorm: 'hele werkwoord → ik',
  hijvorm: 'hele werkwoord → hij / jij',
  inversie: 'hele werkwoord → vraag met jij',
}

export const RULE_LABELS: Record<SpellRule, string> = {
  verdubbel: 'Medeklinker verdubbelen',
  'enkel-medeklinker': 'Dubbele medeklinker valt weg',
  'lange-klank': 'Lange klank korter schrijven',
  'v-f': 'v wordt f',
  'z-s': 'z wordt s',
  apostrof: "Meervoud met 's",
  's-meervoud': 'Meervoud met -s',
  onregelmatig: 'Onregelmatig',
  dt: '-dt',
  'dt-inversie': 'Inversie',
}

export const RULE_EXPLANATIONS: Record<SpellRule, string> = {
  verdubbel:
    'Korte klank in een gesloten lettergreep blijft kort: verdubbel de medeklinker als er een lettergreep bij komt (man → mannen).',
  'enkel-medeklinker':
    'Andersom valt de dubbele medeklinker weg zodra de lettergreep sluit (zitten → ik zit).',
  'lange-klank':
    'Lange klank in een open lettergreep schrijf je met één klinker (boom → bomen, maken → ik maak).',
  'v-f': 'Aan het eind van een lettergreep wordt de v een f (schrijven → ik schrijf, brief → brieven).',
  'z-s': 'Aan het eind van een lettergreep wordt de z een s (lezen → ik lees, huis → huizen).',
  apostrof:
    "Eindigt het woord op een losse a, i, o, u of y? Dan krijgt het meervoud 's (foto → foto's).",
  's-meervoud': 'Woorden op -el, -em, -en, -er of -je krijgen -s in het meervoud.',
  onregelmatig: 'Dit meervoud is onregelmatig. Leer het uit je hoofd.',
  dt: 'Stam + t. Eindigt de stam al op een d? Dan schrijf je toch -dt: hij wordt, jij vindt.',
  'dt-inversie': 'Staat jij ná het werkwoord? Dan valt de -t weg: jij wordt, maar word jij?',
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
