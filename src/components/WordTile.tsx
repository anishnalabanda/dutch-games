interface WordTileProps {
  word: string
  gloss?: string
  isVerb?: boolean
}

/** Dutch word shown clean; English gloss appears as a keyboard-focusable tooltip. */
export function WordTile({ word, gloss, isVerb }: WordTileProps) {
  if (!gloss) {
    return <span className={isVerb ? 'word-tile word-tile-verb' : 'word-tile'}>{word}</span>
  }
  return (
    <span className={`word-tile ${isVerb ? 'word-tile-verb' : ''}`} tabIndex={0}>
      {word}
      <span className="word-tile-gloss" role="tooltip">
        {gloss}
      </span>
    </span>
  )
}
