/**
 * Route volgen: a voicemail explains the way to a building, then the questions
 * ask what to do at each landmark, the way the DUO listening exam asks them
 * ("Wat moet hij doen bij de groene brug?"), plus where to park.
 *
 * The routes are data, the Dutch is built from them, so every sentence follows
 * one of a few patterns. Two patterns are the exam's traps on purpose:
 * - `niet`: "Bij de kerk ga je niet linksaf, maar rechtsaf." Both turns are said;
 *   the one after `maar` counts.
 * - `side`: "De kerk is aan je linkerhand. Daar ga je rechtsaf." The side
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
  overkant: 'aan de overkant',
  straat: 'in de straat',
}

/** Why a place does not work: the reason is what the listener must catch. */
export const PARK_REASON: Record<ParkId, string> = {
  bezoekers: 'De parkeerplaats voor bezoekers is vol.',
  garage: 'De parkeergarage is dicht.',
  overkant: 'Aan de overkant mag je niet parkeren.',
  straat: 'In de straat is het duur.',
}

export const PARK_QUESTION = 'Waar kun je het beste parkeren?'

/** Three ways to say each turn after a fronted place, so the verb varies. */
const TURN_PHRASES: Record<Turn, string[]> = {
  L: ['ga je linksaf', 'sla je linksaf', 'moet je linksaf'],
  R: ['ga je rechtsaf', 'sla je rechtsaf', 'moet je rechtsaf'],
  S: ['ga je rechtdoor', 'rij je rechtdoor', 'moet je rechtdoor'],
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
      return `${landmark[0].toUpperCase()}${landmark.slice(1)} is aan je ${SIDE_WORD[turn]}. Daar ${phrase}.`
  }
}

const SPECS: RouteSpec[] = [
  { id: 'r01', caller: 'Sanne', to: 'het gemeentehuis', stops: [['de brug', 'R', 'als'], ['het park', 'S', 'side']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r02', caller: 'Pieter', to: 'ons kantoor', stops: [['de school', 'L', 'plain'], ['de brug', 'R', 'niet']], park: 'garage', decoy: 'overkant' },
  { id: 'r03', caller: 'Fatima', to: 'de sportschool', stops: [['de bushalte', 'S', 'daar'], ['het zwembad', 'L', 'daar']], park: 'overkant', decoy: 'straat' },
  { id: 'r04', caller: 'Joris', to: 'het ziekenhuis', stops: [['het stoplicht', 'L', 'als'], ['de kerk', 'S', 'niet']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r05', caller: 'Lotte', to: 'het restaurant', stops: [['de bibliotheek', 'R', 'plain'], ['de brug', 'S', 'niet']], park: 'bezoekers', decoy: 'overkant' },
  { id: 'r06', caller: 'Ahmed', to: 'het politiebureau', stops: [['het stoplicht', 'R', 'als'], ['het park', 'L', 'side']], park: 'garage', decoy: 'straat' },
  { id: 'r07', caller: 'Eva', to: 'het buurthuis', stops: [['de bushalte', 'S', 'plain'], ['de apotheek', 'R', 'side']], park: 'overkant', decoy: 'bezoekers' },
  { id: 'r08', caller: 'Daan', to: 'het theater', stops: [['het kruispunt', 'L', 'daar'], ['de kerk', 'L', 'side']], park: 'straat', decoy: 'garage' },
  { id: 'r09', caller: 'Sanne', to: 'het gemeentehuis', stops: [['het tankstation', 'R', 'plain'], ['de brug', 'S', 'niet']], park: 'bezoekers', decoy: 'straat' },
  { id: 'r10', caller: 'Pieter', to: 'ons kantoor', stops: [['de brug', 'R', 'daar'], ['de bibliotheek', 'S', 'als']], park: 'garage', decoy: 'bezoekers' },
  { id: 'r11', caller: 'Fatima', to: 'de sportschool', stops: [['het park', 'L', 'daar'], ['het stoplicht', 'S', 'als']], park: 'overkant', decoy: 'garage' },
  { id: 'r12', caller: 'Joris', to: 'het ziekenhuis', stops: [['de kerk', 'L', 'niet'], ['de bushalte', 'R', 'plain']], park: 'straat', decoy: 'overkant' },
  { id: 'r13', caller: 'Lotte', to: 'het restaurant', stops: [['de brug', 'S', 'daar'], ['het park', 'R', 'side']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r14', caller: 'Ahmed', to: 'het politiebureau', stops: [['het tankstation', 'L', 'plain'], ['het stoplicht', 'R', 'niet']], park: 'garage', decoy: 'overkant' },
  { id: 'r15', caller: 'Eva', to: 'het buurthuis', stops: [['de brug', 'L', 'als'], ['het station', 'S', 'side']], park: 'overkant', decoy: 'straat' },
  { id: 'r16', caller: 'Daan', to: 'het theater', stops: [['het kruispunt', 'L', 'daar'], ['het zwembad', 'R', 'als']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r17', caller: 'Sanne', to: 'het gemeentehuis', stops: [['de bushalte', 'S', 'plain'], ['de school', 'R', 'side']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r18', caller: 'Pieter', to: 'ons kantoor', stops: [['het zwembad', 'L', 'niet'], ['de brug', 'S', 'daar']], park: 'garage', decoy: 'overkant' },
  { id: 'r19', caller: 'Fatima', to: 'de sportschool', stops: [['het zwembad', 'L', 'niet'], ['de bushalte', 'R', 'plain']], park: 'overkant', decoy: 'straat' },
  { id: 'r20', caller: 'Joris', to: 'het ziekenhuis', stops: [['het zwembad', 'S', 'als'], ['de brug', 'L', 'niet']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r21', caller: 'Lotte', to: 'het restaurant', stops: [['de rotonde', 'R', 'plain'], ['de school', 'S', 'side']], park: 'bezoekers', decoy: 'overkant' },
  { id: 'r22', caller: 'Ahmed', to: 'het politiebureau', stops: [['de sporthal', 'L', 'als'], ['de rotonde', 'S', 'daar']], park: 'garage', decoy: 'straat' },
  { id: 'r23', caller: 'Eva', to: 'het buurthuis', stops: [['de apotheek', 'R', 'side'], ['de brug', 'R', 'als']], park: 'overkant', decoy: 'bezoekers' },
  { id: 'r24', caller: 'Daan', to: 'het theater', stops: [['het zwembad', 'L', 'daar'], ['het stoplicht', 'S', 'plain']], park: 'straat', decoy: 'garage' },
  { id: 'r25', caller: 'Sanne', to: 'het gemeentehuis', stops: [['het stoplicht', 'S', 'niet'], ['het station', 'R', 'side']], park: 'bezoekers', decoy: 'straat' },
  { id: 'r26', caller: 'Pieter', to: 'ons kantoor', stops: [['het station', 'L', 'daar'], ['het kruispunt', 'L', 'als']], park: 'garage', decoy: 'bezoekers' },
  { id: 'r27', caller: 'Fatima', to: 'de sportschool', stops: [['het kruispunt', 'R', 'niet'], ['de bibliotheek', 'S', 'side']], park: 'overkant', decoy: 'garage' },
  { id: 'r28', caller: 'Joris', to: 'het ziekenhuis', stops: [['het kruispunt', 'R', 'plain'], ['de apotheek', 'S', 'als']], park: 'straat', decoy: 'overkant' },
  { id: 'r29', caller: 'Lotte', to: 'het restaurant', stops: [['het zwembad', 'L', 'plain'], ['de bushalte', 'R', 'daar']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r30', caller: 'Ahmed', to: 'het politiebureau', stops: [['de bushalte', 'S', 'niet'], ['de sporthal', 'L', 'side']], park: 'garage', decoy: 'overkant' },
  { id: 'r31', caller: 'Eva', to: 'het buurthuis', stops: [['de rotonde', 'R', 'niet'], ['de school', 'L', 'daar']], park: 'overkant', decoy: 'straat' },
  { id: 'r32', caller: 'Daan', to: 'het theater', stops: [['de bibliotheek', 'S', 'als'], ['het kruispunt', 'S', 'plain']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r33', caller: 'Sanne', to: 'het gemeentehuis', stops: [['de apotheek', 'L', 'side'], ['de rotonde', 'R', 'daar']], park: 'bezoekers', decoy: 'garage' },
  { id: 'r34', caller: 'Pieter', to: 'ons kantoor', stops: [['de brug', 'R', 'als'], ['de apotheek', 'S', 'side']], park: 'garage', decoy: 'overkant' },
  { id: 'r35', caller: 'Fatima', to: 'de sportschool', stops: [['de bakker', 'L', 'plain'], ['de rotonde', 'R', 'niet']], park: 'overkant', decoy: 'straat' },
  { id: 'r36', caller: 'Joris', to: 'het ziekenhuis', stops: [['de kerk', 'S', 'plain'], ['het kruispunt', 'L', 'daar']], park: 'straat', decoy: 'bezoekers' },
  { id: 'r37', caller: 'Lotte', to: 'het restaurant', stops: [['de rotonde', 'L', 'niet'], ['de bakker', 'S', 'side']], park: 'bezoekers', decoy: 'overkant' },
  { id: 'r38', caller: 'Ahmed', to: 'het politiebureau', stops: [['de bakker', 'R', 'als'], ['het stoplicht', 'R', 'als']], park: 'garage', decoy: 'straat' },
  { id: 'r39', caller: 'Eva', to: 'het buurthuis', stops: [['het zwembad', 'L', 'daar'], ['de bushalte', 'S', 'plain']], park: 'overkant', decoy: 'bezoekers' },
  { id: 'r40', caller: 'Daan', to: 'het theater', stops: [['de bushalte', 'S', 'niet'], ['het park', 'R', 'side']], park: 'straat', decoy: 'garage' },
]

function build(spec: RouteSpec, index: number): Route {
  const stops = spec.stops.map(([landmark, turn, style], i) => ({
    landmark,
    turn,
    style,
    sentence: stopSentence(landmark, turn, style, i === 0, index + i),
    question: `Wat moet je doen bij ${landmark}?`,
  }))
  const where = `Parkeer ${PARK_PLACE[spec.park]}.`
  // Half the time the ruled-out place comes last, so "the last place said" is no shortcut.
  const parkSentences = index % 2 === 0 ? [where, PARK_REASON[spec.decoy]] : [PARK_REASON[spec.decoy], where]
  return {
    ...spec,
    stops,
    parkSentences,
    // Kept short on purpose: no greeting or goodbye, just the route and the parking.
    sentences: [...stops.map((s) => s.sentence), ...parkSentences],
  }
}

export const routes: Route[] = SPECS.map(build)
