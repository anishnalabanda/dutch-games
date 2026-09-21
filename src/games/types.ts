export type ExamId = 'luisteren' | 'schrijven' | 'knm' | 'spreken'

export interface GameMeta {
  id: string // matches nl.<exam>.<game>
  exam: ExamId
  title: string // Dutch
  subtitle: string // short English: shown on the exam card and on hover in the game header
  core: boolean // core vs optional (affects "ready" honesty)
  total: number // items the game's progress bar counts, taken from its own data
}
