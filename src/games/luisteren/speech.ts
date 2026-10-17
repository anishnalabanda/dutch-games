import { useCallback, useEffect, useState } from 'react'

const synth: SpeechSynthesis | null =
  typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null

// The chosen voice, per device. Not `nl.`-prefixed, so it is never synced as progress.
const VOICE_KEY = '__dutch_voice__'

const SLOW_RATE = 0.5
const NORMAL_RATE = 0.95

function readSavedVoice(): string | null {
  try {
    return localStorage.getItem(VOICE_KEY)
  } catch {
    return null
  }
}

function saveVoice(uri: string) {
  try {
    localStorage.setItem(VOICE_KEY, uri)
  } catch {
    // Not remembered: the choice still holds until the page is left.
  }
}

function langOf(voice: SpeechSynthesisVoice): string {
  return voice.lang.toLowerCase().replace('_', '-')
}

export type VoiceQuality = 'natural' | 'enhanced' | 'standard'

/**
 * How human a voice sounds, read from its name: Edge's neural voices are called
 * "Microsoft Fenna Online (Natural)", Apple's downloaded ones "Claire (Premium)"
 * or "Xander (Enhanced)", and Chrome's server voice "Google Nederlands". The
 * rest (the compact Xander, Microsoft Frank) sound robotic.
 */
export function voiceQuality(voice: SpeechSynthesisVoice): VoiceQuality {
  if (/natural|neural/i.test(voice.name)) return 'natural'
  if (/premium|enhanced|verbeterd|google/i.test(voice.name)) return 'enhanced'
  return 'standard'
}

const QUALITY_RANK: Record<VoiceQuality, number> = { natural: 0, enhanced: 1, standard: 2 }

/**
 * Best-sounding first, so the default is the most listenable voice on the
 * device; within the same quality, Netherlands before Flemish, because the exam
 * is Netherlands Dutch.
 */
function dutchVoices(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice[] {
  const rank = (v: SpeechSynthesisVoice) => QUALITY_RANK[voiceQuality(v)] * 2 + (langOf(v) === 'nl-nl' ? 0 : 1)
  return voices.filter((v) => langOf(v).startsWith('nl')).sort((a, b) => rank(a) - rank(b))
}

/** Where the voice is from, for the picker: the exam is Netherlands Dutch. */
export function voiceRegion(voice: SpeechSynthesisVoice): string {
  const lang = langOf(voice)
  if (lang === 'nl-nl') return 'Netherlands'
  if (lang === 'nl-be') return 'Belgium, Flemish'
  return voice.lang
}

// Utterances handed to the engine and not finished yet, in queue order.
const inFlight: { utterance: SpeechSynthesisUtterance; started: boolean }[] = []
// What to run once it is safe to cancel: see clearThen.
let afterClear: (() => void)[] = []

function flush() {
  if (!synth || afterClear.length === 0) return
  const head = inFlight[0]
  if (head && !head.started) return
  const actions = afterClear
  afterClear = []
  synth.cancel()
  // Late error events from the cancelled utterances find nothing to remove.
  inFlight.length = 0
  actions.forEach((action) => action())
}

/**
 * Empty the engine's queue, then run `action`. Chrome on macOS never recovers
 * from a cancel() that lands before the word at the front has started: it
 * reports speaking for ever and nothing after it plays. So while that word has
 * not started, wait for it to start (or fail) and cancel then. Cancelling a
 * word that is already playing, or words queued behind it, is fine.
 */
function clearThen(action: () => void) {
  afterClear = [action]
  flush()
}

function track(utterance: SpeechSynthesisUtterance) {
  const entry = { utterance, started: false }
  inFlight.push(entry)
  utterance.addEventListener('start', () => {
    entry.started = true
    flush()
  })
  const done = () => {
    const i = inFlight.indexOf(entry)
    if (i >= 0) inFlight.splice(i, 1)
    flush()
  }
  utterance.addEventListener('end', done)
  utterance.addEventListener('error', done)
}

/** Splits after . ! ? so each sentence is its own utterance; a single word stays whole. */
function splitSentences(text: string): string[] {
  const parts = text.match(/[^.!?]+[.!?]*/g)?.map((p) => p.trim()).filter(Boolean) ?? []
  return parts.length > 0 ? parts : [text]
}

export interface SpeakOptions {
  slow?: boolean
  /** Say it with this voice instead of the chosen one: the picker's sample, before the choice has rendered. */
  voice?: SpeechSynthesisVoice
  /** Queue after whatever is already speaking, instead of cutting it off. */
  queue?: boolean
  onStart?: () => void
  onEnd?: () => void
}

export interface DutchSpeech {
  /** False when the browser has no speech synthesis at all. */
  supported: boolean
  /** True once the voice list has loaded and holds no Dutch voice. */
  noDutchVoice: boolean
  /** Every Dutch voice on this device, Netherlands ones first. */
  voices: SpeechSynthesisVoice[]
  voice: SpeechSynthesisVoice | null
  chooseVoice: (voiceURI: string) => void
  speak: (text: string, options?: SpeakOptions) => void
  stop: () => void
}

/**
 * Browser text-to-speech with a Dutch voice. It is a computer voice, not the
 * exam's recordings: good for knowing a word by ear, not a substitute for the
 * DUO practice exams.
 */
export function useDutchSpeech(): DutchSpeech {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceURI, setVoiceURI] = useState<string | null>(readSavedVoice)
  const [loaded, setLoaded] = useState(false)
  const voice = voices.find((v) => v.voiceURI === voiceURI) ?? voices[0] ?? null

  useEffect(() => {
    if (!synth) return
    // Some browsers fill the voice list only after a `voiceschanged` event.
    const load = () => {
      const all = synth.getVoices()
      if (all.length === 0) return
      setVoices(dutchVoices(all))
      setLoaded(true)
    }
    load()
    synth.addEventListener('voiceschanged', load)
    return () => {
      synth.removeEventListener('voiceschanged', load)
      clearThen(() => {})
    }
  }, [])

  const speak = useCallback(
    (text: string, options: SpeakOptions = {}) => {
      const engine = synth
      if (!engine) return
      const v = options.voice ?? voice
      // One utterance per sentence: Chrome's Google voices stop after about 15
      // seconds of a single utterance, so a whole voicemail would be cut off.
      const parts = splitSentences(text)
      parts.forEach((part, i) => {
        const utterance = new SpeechSynthesisUtterance(part)
        utterance.lang = v?.lang ?? 'nl-NL'
        if (v) utterance.voice = v
        utterance.rate = options.slow ? SLOW_RATE : NORMAL_RATE
        if (i === 0 && options.onStart) utterance.onstart = options.onStart
        if (i === parts.length - 1 && options.onEnd) {
          utterance.onend = options.onEnd
          utterance.onerror = options.onEnd
        }
        const start = () => {
          track(utterance)
          engine.speak(utterance)
        }
        if (i === 0 && !options.queue) clearThen(start)
        // Queued behind a cancel that is still waiting: it has to wait too, or the cancel would drop it.
        else if (afterClear.length > 0) afterClear.push(start)
        else start()
      })
    },
    [voice],
  )

  const stop = useCallback(() => clearThen(() => {}), [])

  const chooseVoice = useCallback((uri: string) => {
    setVoiceURI(uri)
    saveVoice(uri)
  }, [])

  return {
    supported: synth !== null,
    noDutchVoice: loaded && voice === null,
    voices,
    voice,
    chooseVoice,
    speak,
    stop,
  }
}
