/**
 * How many items of a game are finished, read straight from whatever it saved.
 *
 * Drill games (`useDrill`) keep the ids they have *mastered*: right on the
 * first attempt. The four exam-task games (`useTasks`) are not drills: they
 * keep the ids of tasks *finished*, with every point covered, hints allowed.
 *
 * Any other save is from before a game moved to `useDrill`, when an item
 * counted once it was right *eventually*, and a miss followed by a correct
 * retry was enough. That measured exposure, not mastery, so it counts for
 * nothing here: the game has to be played again under the first-time rule.
 */
type Saved = Record<string, unknown>

function asRecord(saved: unknown): Saved | null {
  return saved && typeof saved === 'object' ? (saved as Saved) : null
}

export function countFinished(saved: unknown): number {
  const record = asRecord(saved)
  if (!record) return 0
  if (Array.isArray(record.mastered)) return record.mastered.length
  if (Array.isArray(record.finished)) return record.finished.length
  return 0
}

/**
 * Done means every item counted, checked against the game's current total, so
 * a game that gains items stops being done until the new ones are mastered too.
 */
export function isDone(saved: unknown, total: number): boolean {
  const record = asRecord(saved)
  if (!record || !record.done) return false
  return countFinished(record) >= total
}
