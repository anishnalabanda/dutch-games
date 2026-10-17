/**
 * Route volgen: a voicemail explains the way to a building, then the questions
 * ask what to do at each landmark, the way the DUO listening exam asks them
 * ("Wat moet hij doen bij de groene brug?"), plus where to park.
 *
 * The routes are data, the Dutch is built from them, so every sentence follows
 * one of a few patterns. Two patterns are the exam's traps on purpose:
 * - `niet`: "Bij de kerk ga je niet linksaf, maar rechtsaf." Both turns are said;
 *   the one after `maar` counts.
 * - `side`: "Je ziet de kerk aan je linkerhand. Daar ga je rechtsaf." The side
 *   the building is on is not the turn.
 * The parking line always rules one place out with a reason, so the answer is
 * not simply the last place mentioned.
 */

export type Turn = 'L' | 'R' | 'S'
export type Style = 'plain' | 'als' | 'daar' | 'niet' | 'side'
export type ParkId = 'bezoekers' | 'garage' | 'overkant' | 'straat'

type StopSpec = [landmark: string, turn: Turn, style: Style]

interface RouteSpec {
  id: string
  caller: string
  /** The destination, with its article: "het gemeentehuis". */
  to: string
  stops: StopSpec[]
  park: ParkId
  /** A place the message rules out, with a reason. */
  decoy: ParkId
}

export interface Stop {
  landmark: string
  turn: Turn
  style: Style
  /** The Dutch the voicemail says for this stop. */
  sentence: string
  /** The question on screen. */
  question: string
}

export interface Route {
  id: string
  caller: string
  to: string
  stops: Stop[]
  park: ParkId
  decoy: ParkId
  /** Every sentence of the voicemail, in order. */
  sentences: string[]
  /** The parking sentences, for the transcript and the feedback. */
  parkSentences: string[]
}

/** The answer options, in the order DUO lists them. */
export const TURNS: Turn[] = ['L', 'R', 'S']

export const TURN_WORD: Record<Turn, string> = { L: 'linksaf', R: 'rechtsaf', S: 'rechtdoor' }
export const TURN_ARROW: Record<Turn, string> = { L: '←', R: '→', S: '↑' }

export const PARK_PLACES: ParkId[] = ['bezoekers', 'garage', 'overkant', 'straat']

/** Where, as the option shows it and as the sentence says it. */
export const PARK_PLACE: Record<ParkId, string> = {
  bezoekers: 'op de parkeerplaats voor bezoekers',
  garage: 'in de parkeergarage',
  overkant: 'aan de overkant van de weg',
  straat: 'in de straat',
}

/** Why a place does not work: the reason is what the listener must catch. */
export const PARK_REASON: Record<ParkId, string> = {
  bezoekers: 'De parkeerplaats voor bezoekers is vaak vol.',
  garage: 'De parkeergarage is vandaag dicht.',
  overkant: 'Aan de overkant van de weg mag je niet parkeren.',
  straat: 'In de straat is parkeren erg duur.',
}

export const PARK_QUESTION = 'Waar kun je het beste parkeren?'

/** Three ways to say each turn after a fronted place, so the verb varies. */
const TURN_PHRASES: Record<Turn, string[]> = {
  L: ['ga je linksaf', 'sla je linksaf', 'moet je linksaf'],
  R: ['ga je rechtsaf', 'sla je rechtsaf', 'moet je rechtsaf'],
  S: ['ga je rechtdoor', 'rij je gewoon rechtdoor', 'moet je rechtdoor'],
}

/** The turn said first in a `niet` sentence: the wrong one. */
export const NOT_TURN: Record<Turn, Turn> = { L: 'R', R: 'L', S: 'L' }

/** The side named in a `side` sentence: never the side of the turn. */
export const SIDE_WORD: Record<Turn, string> = { L: 'rechterhand', R: 'linkerhand', S: 'linkerhand' }

function stopSentence(landmark: string, turn: Turn, style: Style, first: boolean, variant: number): string {
  const phrase = TURN_PHRASES[turn][variant % 3]
  switch (style) {
    case 'plain':
      return `Bij ${landmark} ${phrase}.`
    case 'als':
      return `Als je bij ${landmark} bent, ${phrase}.`
    case 'daar':
      return `${first ? 'Eerst' : 'Dan'} kom je bij ${landmark}. Daar ${phrase}.`
    case 'niet':
      return `Bij ${landmark} ga je niet ${TURN_WORD[NOT_TURN[turn]]}, maar ${TURN_WORD[turn]}.`
    case 'side':
      return `Je ziet ${landmark} aan je ${SIDE_WORD[turn]}. Daar ${phrase}.`
  }
}

const SPECS: RouteSpec[] = [
  { id: 'r01', caller: 'Sanne', to: 'het gemeentehuis', stops: [['de kerk', 'S', 'plain'], ['de bushalte', 'L', 'daar'], ['het park', 'R', 'als']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r02', caller: 'Pieter', to: 'ons kantoor', stops: [['de bibliotheek', 'L', 'side'], ['de bushalte', 'R', 'niet'], ['de bakker', 'S', 'daar'], ['de apotheek', 'S', 'plain']], park: 'garage', decoy: 'overkant' },
  { id: 'r03', caller: 'Fatima', to: 'de sportschool', stops: [['de brug', 'L', 'niet'], ['de kerk', 'R', 'als'], ['het park', 'S', 'side']], park: 'overkant', decoy: 'straat' },
  { id: 'r04', caller: 'Joris', to: 'het ziekenhuis', stops: [['de bushalte', 'L', 'daar'], ['het park', 'R', 'niet'], ['de kerk', 'L', 'als'], ['het zwembad', 'R', 'plain']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r05', caller: 'Lotte', to: 'het restaurant', stops: [['de rotonde', 'S', 'plain'], ['het park', 'L', 'side'], ['het tankstation', 'R', 'side']], park: 'bezoekers', decoy: 'overkant' },
  { id: 'r06', caller: 'Ahmed', to: 'het politiebureau', stops: [['de kerk', 'S', 'als'], ['de brug', 'L', 'niet'], ['de bibliotheek', 'R', 'daar'], ['de sporthal', 'S', 'plain']], park: 'garage', decoy: 'straat' },
  { id: 'r07', caller: 'Eva', to: 'het buurthuis', stops: [['de bibliotheek', 'S', 'niet'], ['het zwembad', 'R', 'side'], ['de brug', 'L', 'als']], park: 'overkant', decoy: 'bezoekers' },
  { id: 'r08', caller: 'Daan', to: 'het theater', stops: [['de kerk', 'R', 'daar'], ['de bibliotheek', 'S', 'plain'], ['het stoplicht', 'L', 'niet'], ['de apotheek', 'R', 'als']], park: 'straat', decoy: 'garage' },
  { id: 'r09', caller: 'Sanne', to: 'het gemeentehuis', stops: [['de sporthal', 'L', 'daar'], ['het stoplicht', 'S', 'niet'], ['het zwembad', 'S', 'side']], park: 'bezoekers', decoy: 'straat' },
  { id: 'r10', caller: 'Pieter', to: 'ons kantoor', stops: [['het tankstation', 'R', 'plain'], ['het zwembad', 'L', 'side'], ['de bushalte', 'S', 'daar'], ['de bibliotheek', 'L', 'als']], park: 'garage', decoy: 'bezoekers' },
  { id: 'r11', caller: 'Fatima', to: 'de sportschool', stops: [['de bibliotheek', 'R', 'side'], ['het station', 'L', 'plain'], ['de brug', 'S', 'niet']], park: 'overkant', decoy: 'garage' },
  { id: 'r12', caller: 'Joris', to: 'het ziekenhuis', stops: [['de bakker', 'R', 'als'], ['de apotheek', 'R', 'daar'], ['de bibliotheek', 'S', 'daar'], ['de bushalte', 'L', 'als']], park: 'straat', decoy: 'overkant' },
  { id: 'r13', caller: 'Lotte', to: 'het restaurant', stops: [['de apotheek', 'R', 'niet'], ['de bibliotheek', 'S', 'plain'], ['de rotonde', 'L', 'daar']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r14', caller: 'Ahmed', to: 'het politiebureau', stops: [['de apotheek', 'L', 'side'], ['de sporthal', 'S', 'niet'], ['de rotonde', 'R', 'als'], ['de school', 'S', 'side']], park: 'garage', decoy: 'overkant' },
  { id: 'r15', caller: 'Eva', to: 'het buurthuis', stops: [['het kruispunt', 'R', 'plain'], ['de supermarkt', 'L', 'plain'], ['de school', 'L', 'side']], park: 'overkant', decoy: 'straat' },
  { id: 'r16', caller: 'Daan', to: 'het theater', stops: [['het park', 'S', 'daar'], ['de bushalte', 'R', 'als'], ['de kerk', 'S', 'niet'], ['de apotheek', 'R', 'side']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r17', caller: 'Sanne', to: 'het gemeentehuis', stops: [['de kerk', 'L', 'als'], ['het kruispunt', 'R', 'plain'], ['het park', 'S', 'daar']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r18', caller: 'Pieter', to: 'ons kantoor', stops: [['de kerk', 'L', 'niet'], ['de school', 'S', 'plain'], ['het station', 'R', 'als'], ['de brug', 'L', 'niet']], park: 'garage', decoy: 'overkant' },
  { id: 'r19', caller: 'Fatima', to: 'de sportschool', stops: [['de brug', 'L', 'daar'], ['de apotheek', 'R', 'side'], ['de kerk', 'S', 'niet']], park: 'overkant', decoy: 'straat' },
  { id: 'r20', caller: 'Joris', to: 'het ziekenhuis', stops: [['het station', 'R', 'side'], ['de bibliotheek', 'L', 'als'], ['de supermarkt', 'S', 'daar'], ['het stoplicht', 'S', 'plain']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r21', caller: 'Lotte', to: 'het restaurant', stops: [['de bushalte', 'L', 'als'], ['het tankstation', 'R', 'daar'], ['de bibliotheek', 'S', 'plain']], park: 'bezoekers', decoy: 'overkant' },
  { id: 'r22', caller: 'Ahmed', to: 'het politiebureau', stops: [['de bakker', 'L', 'niet'], ['de sporthal', 'R', 'side'], ['het tankstation', 'S', 'als'], ['het stoplicht', 'R', 'daar']], park: 'garage', decoy: 'straat' },
  { id: 'r23', caller: 'Eva', to: 'het buurthuis', stops: [['de supermarkt', 'L', 'niet'], ['de sporthal', 'S', 'plain'], ['de rotonde', 'R', 'daar']], park: 'overkant', decoy: 'bezoekers' },
  { id: 'r24', caller: 'Daan', to: 'het theater', stops: [['het station', 'L', 'side'], ['de bakker', 'L', 'side'], ['de brug', 'R', 'niet'], ['de apotheek', 'S', 'als']], park: 'straat', decoy: 'garage' },
  { id: 'r25', caller: 'Sanne', to: 'het gemeentehuis', stops: [['de bushalte', 'R', 'plain'], ['het park', 'L', 'side'], ['de school', 'S', 'niet']], park: 'bezoekers', decoy: 'straat' },
  { id: 'r26', caller: 'Pieter', to: 'ons kantoor', stops: [['het park', 'S', 'daar'], ['de bushalte', 'R', 'plain'], ['de kerk', 'L', 'als'], ['het station', 'R', 'plain']], park: 'garage', decoy: 'bezoekers' },
  { id: 'r27', caller: 'Fatima', to: 'de sportschool', stops: [['de bibliotheek', 'L', 'niet'], ['de bushalte', 'S', 'daar'], ['de bakker', 'R', 'side']], park: 'overkant', decoy: 'garage' },
  { id: 'r28', caller: 'Joris', to: 'het ziekenhuis', stops: [['de supermarkt', 'S', 'als'], ['de bakker', 'L', 'side'], ['de kerk', 'R', 'plain'], ['de rotonde', 'S', 'als']], park: 'straat', decoy: 'overkant' },
  { id: 'r29', caller: 'Lotte', to: 'het restaurant', stops: [['de brug', 'L', 'daar'], ['de apotheek', 'R', 'niet'], ['het park', 'L', 'plain']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r30', caller: 'Ahmed', to: 'het politiebureau', stops: [['het park', 'S', 'daar'], ['de school', 'S', 'side'], ['het zwembad', 'L', 'niet'], ['de bushalte', 'R', 'als']], park: 'garage', decoy: 'overkant' },
  { id: 'r31', caller: 'Eva', to: 'het buurthuis', stops: [['het stoplicht', 'S', 'als'], ['de supermarkt', 'R', 'plain'], ['het park', 'L', 'side']], park: 'overkant', decoy: 'straat' },
  { id: 'r32', caller: 'Daan', to: 'het theater', stops: [['de rotonde', 'L', 'niet'], ['de bakker', 'S', 'daar'], ['het zwembad', 'R', 'plain'], ['de supermarkt', 'S', 'side']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r33', caller: 'Sanne', to: 'het gemeentehuis', stops: [['het tankstation', 'L', 'daar'], ['de bushalte', 'R', 'als'], ['de bibliotheek', 'R', 'niet']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r34', caller: 'Pieter', to: 'ons kantoor', stops: [['het zwembad', 'S', 'niet'], ['het station', 'L', 'daar'], ['het tankstation', 'R', 'side'], ['de brug', 'S', 'als']], park: 'garage', decoy: 'overkant' },
  { id: 'r35', caller: 'Fatima', to: 'de sportschool', stops: [['de sporthal', 'L', 'plain'], ['het zwembad', 'L', 'als'], ['de rotonde', 'R', 'niet']], park: 'overkant', decoy: 'straat' },
  { id: 'r36', caller: 'Joris', to: 'het ziekenhuis', stops: [['de school', 'S', 'daar'], ['de bakker', 'S', 'plain'], ['de rotonde', 'L', 'daar'], ['de kerk', 'R', 'side']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r37', caller: 'Lotte', to: 'het restaurant', stops: [['de kerk', 'L', 'als'], ['het station', 'S', 'niet'], ['het kruispunt', 'R', 'plain']], park: 'bezoekers', decoy: 'overkant' },
  { id: 'r38', caller: 'Ahmed', to: 'het politiebureau', stops: [['de bibliotheek', 'R', 'side'], ['het kruispunt', 'S', 'daar'], ['het station', 'L', 'plain'], ['de sporthal', 'S', 'niet']], park: 'garage', decoy: 'straat' },
  { id: 'r39', caller: 'Eva', to: 'het buurthuis', stops: [['het kruispunt', 'L', 'als'], ['de bibliotheek', 'R', 'side'], ['de apotheek', 'R', 'als']], park: 'overkant', decoy: 'bezoekers' },
  { id: 'r40', caller: 'Daan', to: 'het theater', stops: [['het park', 'L', 'plain'], ['de kerk', 'S', 'daar'], ['de bibliotheek', 'R', 'side'], ['het stoplicht', 'L', 'niet']], park: 'straat', decoy: 'garage' },
]

function build(spec: RouteSpec, index: number): Route {
  const stops = spec.stops.map(([landmark, turn, style], i) => ({
    landmark,
    turn,
    style,
    sentence: stopSentence(landmark, turn, style, i === 0, index + i),
    question: `Wat moet je doen bij ${landmark}?`,
  }))
  const where = `Bij ${spec.to} kun je het beste ${PARK_PLACE[spec.park]} parkeren.`
  // Half the time the ruled-out place comes last, so "the last place said" is no shortcut.
  const parkSentences = index % 2 === 0 ? [where, PARK_REASON[spec.decoy]] : [PARK_REASON[spec.decoy], where]
  return {
    ...spec,
    stops,
    parkSentences,
    sentences: [
      `Hoi, met ${spec.caller}. Ik leg even uit hoe je bij ${spec.to} komt.`,
      ...stops.map((s) => s.sentence),
      ...parkSentences,
      'Tot straks!',
    ],
  }
}

export const routes: Route[] = SPECS.map(build)
