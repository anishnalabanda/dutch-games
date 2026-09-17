import { useState, type FormEvent } from 'react'
import { signInWithEmail } from '../auth/auth'
import { Button } from '../components/Button'

/**
 * The whole app sits behind this. Progress is keyed to a Supabase user id, so
 * without an account there is nowhere to put it and nothing to come back to.
 */
export function SignIn() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmail(email)
      setSent(true)
    } catch {
      setError('Versturen lukte niet. Controleer je e-mailadres en probeer opnieuw.')
    }
  }

  return (
    <div className="signin">
      <div className="signin-card">
        <h1>Inburgering A2</h1>
        {sent ? (
          <>
            <p className="signin-lead">Check je e-mail.</p>
            <p className="signin-note">
              We hebben een link naar <strong>{email}</strong> gestuurd. Open die link op dit
              apparaat om verder te gaan.
            </p>
            <Button variant="secondary" onClick={() => setSent(false)}>
              Ander e-mailadres
            </Button>
          </>
        ) : (
          <>
            <p className="signin-lead">Vul je e-mailadres in om te beginnen.</p>
            <p className="signin-note">
              Geen wachtwoord. Je krijgt een link per e-mail. Je voortgang hoort bij je account,
              dus je vindt hem terug op je telefoon en je laptop.
            </p>
            <form className="signin-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                autoFocus
                placeholder="jij@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button type="submit">Stuur de link</Button>
            </form>
            {error && <p className="signin-error">{error}</p>}
          </>
        )}
      </div>
    </div>
  )
}
