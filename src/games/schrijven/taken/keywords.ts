/**
 * Word lists the point checks are built from. Each entry is a regex fragment
 * matched from a word start, so `verhuis` also finds `verhuizen` and `verhuisd`.
 * They lean generous: a false "found" costs little, a false "missing" nags.
 */

export const WEEKDAYS = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag']

export const MONTHS = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september',
  'oktober', 'november', 'december',
]

/** A day other than "morgen": a new date, a day off, a return date. */
export const NEW_DATE = [...WEEKDAYS, ...MONTHS, '[0-9]', 'weekend', 'volgende week', 'overmorgen', 'over een week', 'over twee weken']

/** Any time reference at all. */
export const TIME = [
  ...NEW_DATE, 'morgen', 'vandaag', 'gister', 'vanavond', 'vanmiddag', 'vanochtend', 'vanmorgen',
  'ochtend', 'middag', 'avond', 'nacht', 'week', 'weken', 'maand', 'jaar', 'uur', 'half', 'kwart',
  'sinds', 'meestal', 'altijd', 'vaak', 'soms', 'elke', 'elk', 'straks', 'zomer', 'winter', 'lente', 'herfst',
]

/** A reason: the linking words, and the reasons A2 tasks tend to get. */
export const REASON = [
  'want', 'omdat', 'daarom', 'ziek', 'griep', 'koorts', 'pijn', 'dokter', 'huisarts', 'tandarts',
  'ziekenhuis', 'bruiloft', 'trouw', 'verjaardag', 'jarig', 'feest', 'familie', 'begrafenis', 'oppas',
  'kapot', 'verhui[sz]', 'examen', 'vakantie',
]

export const SORRY = ['spijt', 'sorry', 'excuses', 'excuseer', 'vervelend']

/** Saying why you write: the opening sentence of most messages. */
export const WHY_WRITING = [
  'ik (stuur|schrijf|mail)', 'deze (e-)?mail', 'ik wil (u|je|jou) (iets )?vragen', 'vraag', 'laten weten',
]

export const PEOPLE = [
  'familie', 'vrienden', 'vriend', 'vriendin', 'buren', 'buurman', 'buurvrouw', 'kinderen', 'kind',
  'zoon', 'dochter', 'ouders', 'moeder', 'vader', 'broer', 'zus', 'collega', 'iedereen', 'oom', 'tante',
  'opa', 'oma', 'neef', 'nicht', 'gasten', 'mensen', 'man', 'vrouw', 'partner', 'alleen', 'hond',
]

export const COLOURS = [
  'zwart', 'blauw', 'rood', 'rode', 'bruin', 'groen', 'grijs', 'wit', 'geel', 'gele', 'roze', 'paars',
  'oranje', 'zilver', 'goud', 'kleur',
]

export const FOOD = [
  'rijst', 'kip', 'soep', 'pasta', 'vis', 'vlees', 'groente', 'curry', 'brood', 'pizza', 'salade',
  'aardappel', 'taart', 'bonen', 'linzen', 'roti', 'fruit', 'kaas', 'ei', 'cake', 'koekjes', 'hapjes',
  'eten', 'gerecht', 'stamppot', 'appeltaart',
]

export const ACTIVITIES = [
  'wandel', 'fiets', 'sport', 'zwem', 'voetbal', 'kook', 'eet', 'lees', 'slaap', 'winkel', 'boodschap',
  'film', 'tv', 'televisie', 'muziek', 'schoonma', 'bezoek', 'speel', 'spelen', 'koffie', 'thee',
  'hardlo', 'loop', 'tuin', 'dans', 'zing', 'teken', 'schilder', 'yoga', 'fitness', 'gitaar', 'piano',
  'praat', 'drink', 'uitslapen', 'rust',
]
