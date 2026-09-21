import { useEffect, useState } from 'react'
import { Shell } from '../../../components/Shell'
import { WordTile } from '../../../components/WordTile'
import { FeedbackBox } from '../../../components/FeedbackBox'
import { Tag } from '../../../components/Tag'
import { Button } from '../../../components/Button'
import { StreakBadge } from '../../../components/StreakBadge'
import { GlossedText } from '../../../components/GlossedText'
import { useDrill } from '../../useDrill'
import { shuffle } from '../../normalize'
import {
  sentences,
  RULE_LABELS,
  RULE_EXPLANATIONS,
  RULE_SUCCESS,
  RULE_NOTES,
  RULE_PATTERNS,
  RULE_EXAMPLES,
  type WordSpec,
  type RuleType,
} from './data'
import './ZinnenBouwen.css'

const STORE_KEY = 'nl.schrijven.zinnen'

const PLACEHOLDER = 'Tap the words below to start.'

/** Wrong answers allowed before the sentence is given away. */
const MAX_TRIES = 5

/** The rule's frame, one worked example cut into numbered slots. */
function Pattern({ rule }: { rule: RuleType }) {
  return (
    <div className="zinnen-pattern">
      <span className="zinnen-pattern-title">How the sentence is built</span>
      <ol className="zinnen-pattern-slots">
        {RULE_PATTERNS[rule].map((slot, i) => (
          <li key={i} className={slot.isVerb ? 'zinnen-slot zinnen-slot-verb' : 'zinnen-slot'}>
            <span className="zinnen-slot-n">{i + 1}</span>
            <span className="zinnen-slot-text">{slot.text}</span>
            <span className="zinnen-slot-role">{slot.role}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** Marks the words the rule is about, so "the prefix" has something to point at. */
function MarkedSentence({ sentence, mark }: { sentence: string; mark: string[] }) {
  const wanted = new Set(mark.map((w) => w.toLowerCase()))
  return (
    <span>
      {sentence.split(' ').map((word, i) => {
        const bare = word.replace(/[^A-Za-zÀ-ÿ]/g, '').toLowerCase()
        return (
          <span key={i} className={wanted.has(bare) ? 'zinnen-mark' : undefined}>
            {word}
            {i < sentence.split(' ').length - 1 ? ' ' : ''}
          </span>
        )
      })}
    </span>
  )
}

/** More instances of the same rule, for verbs the game has not shown yet. */
function Examples({ rule }: { rule: RuleType }) {
  return (
    <div className="zinnen-pattern">
      <span className="zinnen-pattern-title">More examples</span>
      <ul className="zinnen-examples">
        {RULE_EXAMPLES[rule].map((ex, i) => (
          <li key={i}>
            {ex.from && <span className="zinnen-example-from">{ex.from}</span>}
            <MarkedSentence sentence={ex.sentence} mark={ex.mark} />
          </li>
        ))}
      </ul>
    </div>
  )
}

function Tile({ word, onClick }: { word: WordSpec; onClick: () => void }) {
  return (
    <button
      className={`zinnen-tile ${word.isVerb ? 'zinnen-tile-verb' : ''}`}
      onClick={onClick}
      aria-label={`${word.text} (${word.gloss})`}
    >
      {word.text}
      <span className="zinnen-tile-gloss" role="tooltip">
        {word.gloss}
      </span>
    </button>
  )
}

export function ZinnenBouwen() {
  const drill = useDrill(STORE_KEY, sentences)
  const [bank, setBank] = useState<WordSpec[]>([])
  const [answer, setAnswer] = useState<WordSpec[]>([])
  const [tries, setTries] = useState(0)
  const [feedback, setFeedback] = useState<{
    correct: boolean
    message: string
    revealed: boolean
  } | null>(null)

  const current = drill.current
  const currentId = current?.id

  // Fresh tiles whenever a new sentence comes up: `round` also covers the case
  // where the same sentence is served again because it was missed.
  useEffect(() => {
    if (!current) return
    setBank(shuffle(current.words))
    setAnswer([])
    setFeedback(null)
    setTries(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId, drill.round])

  if (!drill.loaded) return null

  function placeWord(index: number) {
    if (feedback) return
    setAnswer((a) => [...a, bank[index]])
    setBank((b) => b.filter((_, i) => i !== index))
  }

  function unplaceWord(index: number) {
    if (feedback) return
    setBank((b) => [...b, answer[index]])
    setAnswer((a) => a.filter((_, i) => i !== index))
  }

  function check() {
    if (!current || answer.length !== current.words.length) return
    const correct = answer.every((w, i) => w.text === current.words[i].text)
    if (correct) {
      drill.hit()
      setFeedback({
        correct: true,
        message: `${RULE_SUCCESS[current.rule]} ${RULE_NOTES[current.rule]}`,
        revealed: false,
      })
      return
    }
    const used = tries + 1
    setTries(used)
    drill.miss()
    setFeedback({
      correct: false,
      message: RULE_EXPLANATIONS[current.rule],
      revealed: used >= MAX_TRIES,
    })
  }

  function giveUp() {
    if (!current || feedback?.revealed) return
    drill.miss()
    setFeedback({ correct: false, message: RULE_EXPLANATIONS[current.rule], revealed: true })
  }

  function retry() {
    if (!current) return
    setBank(shuffle(current.words))
    setAnswer([])
    setFeedback(null)
  }

  if (!current) {
    return (
      <Shell title="Zinnen bouwen" backTo="/schrijven">
        <FeedbackBox
          correct
          message={`Done. You put all ${sentences.length} sentences in the right order first time. Best streak: ${drill.state.bestStreak}.`}
        />
        <Button onClick={drill.restart}>Practise again</Button>
      </Shell>
    )
  }

  return (
    <Shell
      title="Zinnen bouwen"
      backTo="/schrijven"
      progress={{ value: drill.mastered, max: drill.total }}
    >
      <div className="zinnen-header-row">
        <Tag>{RULE_LABELS[current.rule]}</Tag>
        <StreakBadge label="Streak" value={drill.state.streak} />
      </div>

      <p className="zinnen-prompt">
        <span className="zinnen-prompt-label">Translate</span>
        {current.prompt}
      </p>

      {current.hint && (
        <p className="zinnen-hint">
          Infinitive:{' '}
          <strong>
            <GlossedText text={current.hint} />
          </strong>
        </p>
      )}

      <div className="zinnen-answer" aria-label="Your sentence">
        {answer.length === 0 && (
          <span className="zinnen-placeholder">{PLACEHOLDER}</span>
        )}
        {answer.map((word, i) => (
          <Tile key={`${word.text}-${i}`} word={word} onClick={() => unplaceWord(i)} />
        ))}
      </div>

      <div className="zinnen-bank" aria-label="Available words">
        {bank.map((word, i) => (
          <Tile key={`${word.text}-${i}`} word={word} onClick={() => placeWord(i)} />
        ))}
      </div>

      {feedback && (
        <>
          <FeedbackBox
            correct={feedback.correct}
            message={feedback.message}
          />
          <Pattern rule={current.rule} />
          <Examples rule={current.rule} />
          {!feedback.correct && !feedback.revealed && (
            <p className="zinnen-tries">
              Attempt {tries} of {MAX_TRIES}
            </p>
          )}
          {feedback.revealed && (
            <p className="zinnen-answer-key">
              Right sentence:{' '}
              {current.words.map((w, i) => (
                <span key={i}>
                  <WordTile word={w.text} gloss={w.gloss} isVerb={w.isVerb} />{' '}
                </span>
              ))}
            </p>
          )}
        </>
      )}

      <div className="zinnen-actions">
        {!feedback && (
          <Button onClick={check} disabled={bank.length > 0}>
            Check
          </Button>
        )}
        {!feedback?.correct && !feedback?.revealed && (
          <Button variant="secondary" onClick={giveUp}>
            Give up
          </Button>
        )}
        {feedback?.correct && <Button onClick={drill.advance}>Next</Button>}
        {feedback && !feedback.correct && !feedback.revealed && (
          <Button onClick={retry}>Try again</Button>
        )}
        {feedback?.revealed && <Button onClick={drill.advance}>Next</Button>}
      </div>
    </Shell>
  )
}
