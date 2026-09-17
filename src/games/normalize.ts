/** Lowercases, drops end punctuation and collapses whitespace for typed answers. */
export function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
}

/** True when a typed answer matches the model answer or any accepted variant. */
export function matchesAnswer(input: string, answer: string, accept: string[] = []): boolean {
  const typed = normalize(input)
  return [answer, ...accept].some((candidate) => normalize(candidate) === typed)
}

/** Fisher-Yates; never returns the original order for lists of 2 or more. */
export function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  if (copy.length > 1 && copy.every((item, i) => item === items[i])) return shuffle(items)
  return copy
}
