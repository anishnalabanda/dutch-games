import { GlossedText } from '../components/GlossedText'

type Part = { kind: 'same' | 'del' | 'add'; text: string }

/** Words, with punctuation as tokens of its own, so "tennis" and "tennis." still match. */
const tokens = (text: string) => text.match(/[^\s.,!?;:]+|[.,!?;:]/g) ?? []
const isPunct = (token: string) => /^[.,!?;:]$/.test(token)
/** Words joined with spaces, punctuation straight after the word before it. */
const join = (list: string[]) => list.reduce((out, t, i) => (i === 0 || isPunct(t) ? out + t : `${out} ${t}`), '')

/** Word-level difference: the longest run of words both share stays, the rest is removed or added. */
function diffWords(from: string, to: string): Part[] {
  const a = tokens(from)
  const b = tokens(to)
  // lcs[i][j]: words in common between a[i..] and b[j..].
  const lcs = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i] === b[j] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }
  const runs: { kind: Part['kind']; words: string[] }[] = []
  const push = (kind: Part['kind'], word: string) => {
    const last = runs.at(-1)
    if (last?.kind === kind) last.words.push(word)
    else runs.push({ kind, words: [word] })
  }
  let i = 0
  let j = 0
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      push('same', a[i])
      i++
      j++
    } else if (j < b.length && (i === a.length || lcs[i][j + 1] >= lcs[i + 1][j])) {
      push('add', b[j++])
    } else {
      push('del', a[i++])
    }
  }
  // A removal reads best straight before what replaces it.
  for (let k = 0; k < runs.length - 1; k++) {
    if (runs[k].kind === 'add' && runs[k + 1].kind === 'del') [runs[k], runs[k + 1]] = [runs[k + 1], runs[k]]
  }
  return runs.map((run) => ({ kind: run.kind, text: join(run.words) }))
}

/**
 * A correction in one line: the words that stay, each wrong word struck
 * through and the right one straight after it, so only what changed stands
 * out. Used wherever Claude's corrections are shown.
 */
export function FixDiff({ original, corrected }: { original: string; corrected: string }) {
  const parts = diffWords(original, corrected)
  return (
    <p className="ai-diff">
      {parts.map((part, i) => {
        const text = <GlossedText text={part.text} />
        // No space before a part that starts with punctuation: "tennis" then "."
        const next = parts[i + 1]
        const space = next && !isPunct(next.text[0]) ? ' ' : ''
        if (part.kind === 'del') return <del key={i} className="ai-diff-del">{text}{space}</del>
        if (part.kind === 'add') return <ins key={i} className="ai-diff-add">{text}{space}</ins>
        return <span key={i}>{text}{space}</span>
      })}
    </p>
  )
}
