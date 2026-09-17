export type ExamId = 'luisteren' | 'schrijven' | 'knm' | 'spreken'

export interface GameMeta {
  id: string // matches nl.<exam>.<game>
  exam: ExamId
  title: string // Dutch
  subtitle?: string // short English
  core: boolean // core vs optional (affects "ready" honesty)
}
