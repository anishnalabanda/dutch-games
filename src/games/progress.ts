/**
 * How many items of a game are finished, read straight from whatever it saved.
 *
 * Games store their progress in one of two shapes: `useDrill` games keep the
 * ids they have *mastered* (right on the first attempt), the older hand-rolled
 * games keep `completedIds` (right eventually). Schrijfopdracht keeps two
 * lists, one per level, and its bar counts both. Summing whichever of these
 * keys is present covers every game without the exam page knowing which is
 * which.
 */
const COUNTED_KEYS = ['mastered', 'completedIds', 'stemIds'] as const

export function countFinished(saved: unknown): number {
  if (!saved || typeof saved !== 'object') return 0
  const record = saved as Record<string, unknown>
  let total = 0
  for (const key of COUNTED_KEYS) {
    const value = record[key]
    if (Array.isArray(value)) total += value.length
  }
  return total
}

export function isDone(saved: unknown): boolean {
  return Boolean(saved && typeof saved === 'object' && (saved as { done?: boolean }).done)
}
