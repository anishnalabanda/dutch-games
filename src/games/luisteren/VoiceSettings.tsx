import { voiceQuality, voiceRegion, type DutchSpeech } from './speech'
import './VoiceSettings.css'

const VOICE_SAMPLE = 'Hallo, dit is mijn stem. Bij de brug ga je linksaf.'

/**
 * The voice picker and what to do when the device's voices are poor, shared by
 * every Luisteren game. The list is sorted best-sounding first, so the default
 * is already the most listenable voice the device has.
 */
export function VoiceSettings({ speech }: { speech: DutchSpeech }) {
  if (!speech.supported) return null
  const best = speech.voices[0]
  const robotic = best !== undefined && voiceQuality(best) === 'standard'

  return (
    <>
      {speech.voices.length > 0 && (
        <label className="lv-voice">
          Voice
          <select
            value={speech.voice?.voiceURI ?? ''}
            onChange={(e) => {
              const chosen = speech.voices.find((v) => v.voiceURI === e.target.value)
              if (!chosen) return
              speech.chooseVoice(chosen.voiceURI)
              speech.speak(VOICE_SAMPLE, { voice: chosen })
            }}
          >
            {speech.voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({voiceRegion(v)})
              </option>
            ))}
          </select>
        </label>
      )}

      {speech.noDutchVoice && (
        <p className="g-hint">
          This device has no Dutch voice, so the Dutch is read with an English accent. See below
          for how to get a good one.
        </p>
      )}

      {(robotic || speech.noDutchVoice) && (
        <div className="lv-tips">
          <p className="lv-tips-title">The voices on this device sound robotic. For a natural one:</p>
          <ul>
            <li>
              <strong>Best:</strong> open this site in <strong>Microsoft Edge</strong> (free, on Mac
              and Windows). It has natural Dutch voices: pick <em>Fenna</em> or <em>Maarten
              (Natural)</em> above. They need an internet connection.
            </li>
            <li>
              <strong>Mac:</strong> System Settings, Accessibility, Spoken Content, System voice,
              Manage Voices, Dutch: download <em>Claire</em> or <em>Xander</em> in the Premium or
              Enhanced version, then quit and reopen the browser. Safari shows these; Chrome may not.
            </li>
            <li>
              <strong>iPhone:</strong> Settings, Accessibility, Spoken Content, Voices, Dutch:
              download <em>Claire</em> or <em>Xander</em> (Enhanced or Premium), then use Safari.
              Siri voices are not available to web pages.
            </li>
          </ul>
        </div>
      )}
    </>
  )
}
