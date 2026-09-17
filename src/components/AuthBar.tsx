import { useState, type FormEvent } from 'react'
import { signInWithEmail, signOut } from '../auth/auth'
import { useAuthSession, useProgressStore } from '../store/StoreProvider'
import { Button } from './Button'

export function AuthBar() {
  const { session, loading, cloudSync } = useAuthSession()
  const store = useProgressStore()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [importText, setImportText] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function handleSignIn(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await signInWithEmail(email)
    setSent(true)
  }

  async function handleExport() {
    const data = await store.all()
    const snapshot = { version: 1, exported: new Date().toISOString(), data }
    await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2))
    setStatus('Voortgang gekopieerd naar het klembord.')
  }

  async function handleImport() {
    try {
      const snapshot = JSON.parse(importText) as { data?: Record<string, unknown> }
      await store.bulk(snapshot.data ?? {})
      setStatus('Voortgang geimporteerd.')
      setImportText('')
      setShowImport(false)
    } catch {
      setStatus('Kon de data niet lezen. Controleer het JSON-formaat.')
    }
  }

  if (loading) return null

  return (
    <div className="auth-bar">
      {!cloudSync ? (
        // Local dev build: the store is localStorage only, so sign-in would
        // promise a sync that never happens. Say so instead of offering it.
        <span className="auth-bar-status" title="VITE_CLOUD_SYNC=on schakelt sync in">
          Lokaal &mdash; geen cloud-sync
        </span>
      ) : session ? (
        <>
          <span className="auth-bar-email">{session.user.email}</span>
          <Button variant="secondary" onClick={() => void signOut()}>
            Sign out
          </Button>
        </>
      ) : sent ? (
        <span className="auth-bar-status">Check je e-mail voor de link.</span>
      ) : (
        <form className="auth-bar-form" onSubmit={handleSignIn}>
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" variant="secondary">
            Sign in
          </Button>
        </form>
      )}
      <Button variant="secondary" onClick={() => void handleExport()}>
        Export
      </Button>
      <Button variant="secondary" onClick={() => setShowImport((v) => !v)}>
        Import
      </Button>
      {showImport && (
        <div className="auth-bar-import">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder="Plak hier je export..."
          />
          <Button variant="secondary" onClick={() => void handleImport()}>
            Toepassen
          </Button>
        </div>
      )}
      {status && <p className="auth-bar-message">{status}</p>}
    </div>
  )
}
