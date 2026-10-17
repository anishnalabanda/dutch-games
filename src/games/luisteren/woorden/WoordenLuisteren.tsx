import { useEffect, useMemo, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { Button } from '../../../components/Button'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { StreakBadge } from '../../../components/StreakBadge'
import { useCurrentGame } from '../../currentGame'
import { useDrill, type Drill } from '../../useDrill'
import { useDutchSpeech } from '../speech'
import { VoiceSettings } from '../VoiceSettings'
import { Steps, firstOpenStep, type StepDef } from '../Steps'
import { optionsFor, themeFromKey, wordsByTheme, type ListenWord } from './data'
import {
  CONVERSATIONS_SUFFIX,
  SENTENCES_SUFFIX,
  conversationsByTheme,
  sentencesByTheme,
  type ListenConversation,
  type ListenSentence,
} from './zinnen'
import { SentenceStep } from './SentenceStep'
import { ConversationStep } from './ConversationStep'
import './WoordenLuisteren.css'

type Mode = 'list' | 'drill'

const NO_WORDS: ListenWord[] = []
const NO_SENTENCES: ListenSentence[] = []
const NO_CONVERSATIONS: ListenConversation[] = []

type Step = 'woorden' | 'zinnen' | 'gesprek'

const STEPS: StepDef<Step>[] = [
  { id: 'woorden', label: '1. Words', countLabel: 'recognised first time' },
  { id: 'zinnen', label: '2. Sentences', countLabel: 'sentences right first time' },
  { id: 'gesprek', label: '3. Conversation', countLabel: 'conversations right first time' },
]

/**
 * One game per theme, all on this component: the manifest entry on screen says
 * which theme. It builds up in three steps, each its own drill: the words (a
 * list to go over, then hear-it-pick-the-meaning), then single sentences, then
 * short conversations asked the way the exam asks. It opens on the first step
 * not done; the hub counts the words, the game's own key.
 */
export function WoordenLuisteren() {
  const meta = useCurrentGame()
  const key = meta?.id ?? ''
  const theme = themeFromKey(key)
  const items = theme ? wordsByTheme[theme] : NO_WORDS
  const sentences = theme ? sentencesByTheme[theme] : NO_SENTENCES
  const conversations = theme ? conversationsByTheme[theme] : NO_CONVERSATIONS
  const wordDrill = useDrill(key, items)
  const sentenceDrill = useDrill(`${key}${SENTENCES_SUFFIX}`, sentences)
  const conversationDrill = useDrill(`${key}${CONVERSATIONS_SUFFIX}`, conversations)
  const speech = useDutchSpeech()
  const [step, setStep] = useState<Step | null>(null)
  const loaded = wordDrill.loaded && sentenceDrill.loaded && conversationDrill.loaded
  const drills: Record<Step, Drill<{ id: string }>> = {
    woorden: wordDrill,
    zinnen: sentenceDrill,
    gesprek: conversationDrill,
  }

  useEffect(() => {
    if (loaded && step === null) setStep(firstOpenStep(STEPS, drills))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, step])

  if (!meta || !theme) return <p>Unknown game.</p>
  if (!loaded || step === null) return null

  const active = drills[step]
  const stepMeta = STEPS.find((s) => s.id === step)!

  function go(next: Step) {
    speech.stop()
    setStep(next)
  }

  return (
    <Shell
      title={meta.title}
      backTo="/luisteren"
      progress={{ value: active.mastered, max: active.total }}
      countLabel={stepMeta.countLabel}
    >
      <Steps steps={STEPS} current={step} drills={drills} onChoose={go} />

      <VoiceSettings speech={speech} />

      {step === 'woorden' && (
        <WordPractice
          items={items}
          drill={wordDrill}
          speech={speech}
          next={{ label: 'Next: sentences', onClick: () => go('zinnen') }}
        />
      )}
      {step === 'zinnen' && (
        <SentenceStep items={sentences} drill={sentenceDrill} speech={speech} onNext={() => go('gesprek')} />
      )}
      {step === 'gesprek' && <ConversationStep items={conversations} drill={conversationDrill} speech={speech} />}

      <p className="g-hint">
        This is a computer voice. The exam plays real recordings at normal speed, so do the DUO
        practice exams on inburgeren.nl as well.
      </p>
    </Shell>
  )
}

type Speech = ReturnType<typeof useDutchSpeech>

/** The word list and the listen drill with the switch between them: Route volgen uses it too. */
export function WordPractice({
  items,
  drill,
  speech,
  next,
}: {
  items: ListenWord[]
  drill: Drill<ListenWord>
  speech: Speech
  /** Where to go once every word is recognised. */
  next?: { label: string; onClick: () => void }
}) {
  const [mode, setMode] = useState<Mode>('list')
  return (
    <>
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

      {mode === 'list' ? (
        <WordList items={items} mastered={drill.state.mastered} speech={speech} />
      ) : (
        <ListenDrill items={items} drill={drill} speech={speech} onList={() => setMode('list')} next={next} />
      )}
    </>
  )
}

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
  next,
}: {
  items: ListenWord[]
  drill: Drill<ListenWord>
  speech: Speech
  onList: () => void
  next?: { label: string; onClick: () => void }
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
          {next && <Button onClick={next.onClick}>{next.label}</Button>}
          <Button variant={next ? 'secondary' : 'primary'} onClick={drill.restart}>
            Practise again
          </Button>
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
