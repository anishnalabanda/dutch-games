import { useEffect, useMemo, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { useCurrentGame } from '../../currentGame'
import { useDrill, type Drill } from '../../useDrill'
import { useDutchSpeech } from '../speech'
import { VoiceSettings } from '../VoiceSettings'
import { optionsFor, themeFromKey, wordsByTheme, type ListenWord } from './data'
import './WoordenLuisteren.css'

type Mode = 'list' | 'drill'

const NO_WORDS: ListenWord[] = []

/**
 * One game per theme, all on this component: the manifest entry on screen says
 * which theme. The list is for going over the words, Dutch with the meaning
 * underneath and a button to hear it. The drill only says the word: pick the
 * meaning, and it counts once it is right first time.
 */
export function WoordenLuisteren() {
  const meta = useCurrentGame()
  const key = meta?.id ?? ''
  const theme = themeFromKey(key)
  const items = theme ? wordsByTheme[theme] : NO_WORDS
  const drill = useDrill(key, items)
  const speech = useDutchSpeech()
  const [mode, setMode] = useState<Mode>('list')

  if (!meta || !theme) return <p>Unknown game.</p>
  if (!drill.loaded) return null

  const title = meta.title
  return (
    <Shell
      title={title}
      backTo="/luisteren"
      progress={{ value: drill.mastered, max: drill.total }}
      countLabel="recognised first time"
    >
      <div className="g-chips" role="group" aria-label="Mode">
        <button
          type="button"
          className={`g-chip ${mode === 'list' ? 'g-chip-selected' : ''}`}
          aria-pressed={mode === 'list'}
          onClick={() => {
            speech.stop()
            setMode('list')
          }}
        >
          Word list
        </button>
        <button
          type="button"
          className={`g-chip ${mode === 'drill' ? 'g-chip-selected' : ''}`}
          aria-pressed={mode === 'drill'}
          onClick={() => {
            speech.stop()
            setMode('drill')
          }}
        >
          Listen and choose
        </button>
      </div>

      <VoiceSettings speech={speech} />

      {mode === 'list' ? (
        <WordList items={items} mastered={drill.state.mastered} speech={speech} />
      ) : (
        <ListenDrill items={items} drill={drill} speech={speech} onList={() => setMode('list')} />
      )}

      <p className="g-hint">
        This is a computer voice reading single words. The exam plays real recordings at normal
        speed, so do the DUO practice exams on inburgeren.nl as well.
      </p>
    </Shell>
  )
}

type Speech = ReturnType<typeof useDutchSpeech>

function WordList({
  items,
  mastered,
  speech,
}: {
  items: ListenWord[]
  mastered: string[]
  speech: Speech
}) {
  const [hideEnglish, setHideEnglish] = useState(false)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [playing, setPlaying] = useState<string | null>(null)
  const [playingAll, setPlayingAll] = useState(false)

  function playAll() {
    setPlayingAll(true)
    items.forEach((w, i) => {
      speech.speak(w.nl, {
        queue: i > 0,
        onStart: () => setPlaying(w.id),
        onEnd:
          i === items.length - 1
            ? () => {
                setPlaying(null)
                setPlayingAll(false)
              }
            : undefined,
      })
    })
  }

  function stopAll() {
    speech.stop()
    setPlaying(null)
    setPlayingAll(false)
  }

  return (
    <>
      <div className="g-row lw-toolbar">
        {speech.supported &&
          (playingAll ? (
            <Button variant="secondary" onClick={stopAll}>
              Stop
            </Button>
          ) : (
            <Button variant="secondary" onClick={playAll}>
              Play all
            </Button>
          ))}
        <label className="lw-toggle">
          <input
            type="checkbox"
            checked={hideEnglish}
            onChange={(e) => {
              setHideEnglish(e.target.checked)
              setRevealed(new Set())
            }}
          />
          Hide the English (test yourself)
        </label>
      </div>

      <ul className="lw-list">
        {items.map((w) => {
          const known = mastered.includes(w.id)
          const showEnglish = !hideEnglish || revealed.has(w.id)
          return (
            <li key={w.id} className={`lw-item ${playing === w.id ? 'lw-item-playing' : ''}`}>
              {speech.supported && (
                <button
                  type="button"
                  className="lw-play"
                  aria-label={`Play "${w.nl}"`}
                  onClick={() => speech.speak(w.nl)}
                >
                  &#9654;
                </button>
              )}
              <div className="lw-text">
                <span className="lw-nl" lang="nl">
                  {w.nl}
                </span>
                {showEnglish ? (
                  <span className="lw-en">{w.en}</span>
                ) : (
                  <button
                    type="button"
                    className="lw-reveal"
                    onClick={() => setRevealed((r) => new Set(r).add(w.id))}
                  >
                    Show meaning
                  </button>
                )}
              </div>
              {known && (
                <span className="lw-known" title="Recognised first time in the drill">
                  &#10003;
                  <span className="lw-sr">Recognised first time in the drill</span>
                </span>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )
}

function ListenDrill({
  items,
  drill,
  speech,
  onList,
}: {
  items: ListenWord[]
  drill: Drill<ListenWord>
  speech: Speech
  onList: () => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [shown, setShown] = useState(false)
  const current = drill.current
  const currentId = current?.id
  const { speak } = speech

  // New wrong options for every presentation, including a repeat of a missed word.
  const options = useMemo(
    () => (current ? optionsFor(current, items) : []),
    [current, drill.round, items],
  )

  // Say each new word as it comes up: the drill is by ear.
  useEffect(() => {
    setChosen(null)
    setShown(false)
    if (current) speak(current.nl)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!current) {
    return (
      <div className="g-done">
        <FeedbackBox
          correct
          message={`Done. You recognised all ${items.length} words by ear, first time. Best streak: ${drill.state.bestStreak}.`}
        />
        <div className="g-actions">
          <Button onClick={drill.restart}>Practise again</Button>
          <Button variant="secondary" onClick={onList}>
            Back to the word list
          </Button>
        </div>
      </div>
    )
  }

  const answered = chosen !== null
  const right = chosen === current.en
  // Without speech synthesis the drill can only be read, so the word is on screen from the start.
  const wordVisible = answered || shown || !speech.supported

  function choose(option: string) {
    if (answered || !current) return
    setChosen(option)
    if (option === current.en) drill.hit()
    else if (!shown) drill.miss()
  }

  function showWord() {
    // Reading the word is not hearing it: the word comes round again.
    if (!shown && !answered) drill.miss()
    setShown(true)
  }

  return (
    <>
      <div className="g-row">
        <span className="g-hint">Listen, then choose what the word means.</span>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <div className="lw-board">
        {speech.supported && (
          <div className="g-actions">
            <Button onClick={() => speak(current.nl)}>&#9654; Play again</Button>
            <Button variant="secondary" onClick={() => speak(current.nl, { slow: true })}>
              Slower
            </Button>
          </div>
        )}
        {wordVisible ? (
          <span className="lw-board-word" lang="nl">
            {current.nl}
          </span>
        ) : (
          <button type="button" className="lw-reveal" onClick={showWord}>
            Show the word (counts as a miss)
          </button>
        )}
      </div>

      <div className="lw-options" role="group" aria-label="Meaning">
        {options.map((option) => {
          const state = !answered
            ? ''
            : option === current.en
              ? 'g-chip-ok'
              : option === chosen
                ? 'g-chip-alert'
                : ''
          return (
            <button
              key={option}
              type="button"
              className={`g-chip lw-option ${state}`}
              disabled={answered}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          )
        })}
      </div>

      {answered && (
        <FeedbackBox
          correct={right && !shown}
          message={
            right
              ? shown
                ? `Right, "${current.nl}" means "${current.en}". You read it this time, so it comes round again to hear.`
                : `"${current.nl}" means "${current.en}".`
              : `"${current.nl}" means "${current.en}", not "${chosen}". It comes round again.`
          }
        />
      )}

      {answered && (
        <div className="g-actions">
          <Button autoFocus onClick={drill.advance}>
            Next
          </Button>
        </div>
      )}
    </>
  )
}
