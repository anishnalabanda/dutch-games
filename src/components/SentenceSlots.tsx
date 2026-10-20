import { GlossedText } from './GlossedText'

export interface Slot {
  /** Dutch: the words filling this slot, one chunk of meaning. */
  text: string
  /** English: what the slot is for. */
  role: string
  /** Verb slots are coloured, so the frame of the sentence stands out. */
  isVerb?: boolean
}

/**
 * A Dutch sentence cut into numbered slots, each with its role underneath, so
 * the word order can be seen and not only described: the conjugated verb in
 * slot 2, the other verbs at the end. Used by Zinnen bouwen's worked examples
 * and by Claude's review; on a `g-worksheet` card the slots turn light.
 */
export function SentenceSlots({ slots }: { slots: Slot[] }) {
  return (
    <ol className="sentence-slots">
      {slots.map((slot, i) => (
        <li key={i} className={slot.isVerb ? 'sentence-slot sentence-slot-verb' : 'sentence-slot'}>
          <span className="sentence-slot-n">{i + 1}</span>
          <GlossedText className="sentence-slot-text" text={slot.text} />
          <span className="sentence-slot-role">{slot.role}</span>
        </li>
      ))}
    </ol>
  )
}
