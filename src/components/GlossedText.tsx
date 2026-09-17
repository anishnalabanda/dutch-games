import { Fragment } from 'react'
import { WordTile } from './WordTile'
import { lookupWord } from '../games/glossary'

interface GlossedTextProps {
  /** Dutch text. Words in the glossary get a focusable English tooltip. */
  text: string
  className?: string
}

const WORD = /([A-Za-zÀ-ÿ]+(?:['’-][A-Za-zÀ-ÿ]+)*)/g

/**
 * Renders Dutch text clean and full size, with a per-word English gloss on
 * hover or keyboard focus (AGENTS.md section 7). Never inline translations into
 * the Dutch line; unknown words simply render as plain text.
 *
 * Do not use inside a <button>: the word tooltips are focusable themselves.
 */
export function GlossedText({ text, className }: GlossedTextProps) {
  const parts = text.split(WORD)
  return (
    <span className={className}>
      {parts.map((part, i) => {
        const entry = i % 2 === 1 ? lookupWord(part) : null
        if (!entry) return <Fragment key={i}>{part}</Fragment>
        return <WordTile key={i} word={part} gloss={entry.gloss} isVerb={entry.verb} />
      })}
    </span>
  )
}
