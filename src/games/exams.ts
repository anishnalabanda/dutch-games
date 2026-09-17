import type { ExamId } from './types'

export interface ExamInfo {
  id: ExamId
  title: string
  subtitle: string
}

// Lezen is cleared (no games needed) and ONA is a task checklist, not games: 
// neither gets a hub card here. Keep section 1 of AGENTS.md updated as this changes.
export const exams: ExamInfo[] = [
  { id: 'luisteren', title: 'Luisteren', subtitle: 'Listening' },
  { id: 'schrijven', title: 'Schrijven', subtitle: 'Writing' },
  { id: 'knm', title: 'KNM', subtitle: 'Kennis van de Nederlandse Maatschappij' },
  { id: 'spreken', title: 'Spreken', subtitle: 'Speaking' },
]
