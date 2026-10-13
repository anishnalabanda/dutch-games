import { useState, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { testKey } from './claude'
import { clearClaudeKey, isRemembered, setClaudeKey, useClaudeKey } from './key'
import './ai.css'

/**
 * Where the owner adds or removes their Anthropic API key. Collapsed by
 * default; the summary line says whether Claude feedback is on.
 */
export function ClaudePanel() {
  const key = useClaudeKey()
  const [draft, setDraft] = useState('')
  const [remember, setRemember] = useState(true)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const value = draft.trim()
    if (value === '') return
    setChecking(true)
    setError(null)
    try {
      await testKey(value)
      setClaudeKey(value, remember)
      setDraft('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The key could not be checked.')
    } finally {
      setChecking(false)
    }
  }

  return (
    <details className="ai-panel">
      <summary>
        Claude feedback: <span className={key ? 'ai-on' : 'ai-off'}>{key ? 'on' : 'off'}</span>
      </summary>
      {key ? (
        <div className="ai-panel-body">
          <p>
            Hint and Submit now ask Claude, which reads your Dutch for meaning, word order and spelling,
            not just for keywords. Each check costs a few cents on your own Anthropic account.
          </p>
          <p className="ai-small">
            Key {isRemembered() ? 'remembered on this device' : 'kept until this tab closes'}, ending in{' '}
            <code>{key.slice(-4)}</code>.
          </p>
          <div className="g-actions">
            <Button variant="secondary" onClick={clearClaudeKey}>
              Remove key
            </Button>
          </div>
        </div>
      ) : (
        <form className="ai-panel-body" onSubmit={save}>
          <p>
            Without a key, hints come from pattern checks that look for words, not meaning. With your own
            Anthropic API key, Claude reads what you wrote and marks it the way a DUO examiner would.
          </p>
          <label className="ai-field">
            <span className="g-label">Anthropic API key</span>
            <input
              type="password"
              value={draft}
              placeholder="sk-ant-..."
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <label className="ai-check">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember on this device
          </label>
          {error && <p className="ai-error">{error}</p>}
          <div className="g-actions">
            <Button type="submit" disabled={checking || draft.trim() === ''}>
              {checking ? 'Checking key…' : 'Save key'}
            </Button>
          </div>
          <p className="ai-small">
            Make a key just for this app at{' '}
            <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noreferrer">
              console.anthropic.com
            </a>{' '}
            and give its workspace a monthly spend limit. The key stays in this browser: it is never synced
            with your progress and only ever sent to Anthropic. Anyone using this browser, and any other site
            you publish on the same github.io address, could read it. Switching address removes it.
          </p>
        </form>
      )}
    </details>
  )
}
