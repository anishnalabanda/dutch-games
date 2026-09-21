import { useState, type FormEvent } from 'react'
import { useIdentity } from '../store/StoreProvider'
import { Button } from '../components/Button'

/**
 * The whole app sits behind this. There is no password and no confirmation:
 * the address is a name tag that says which progress to load. See
 * supabase/schema.sql for what that means for the data.
 */
export function SignIn() {
  const { signIn } = useIdentity()
  const [email, setEmail] = useState('')

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const trimmed = email.trim()
    if (trimmed) signIn(trimmed)
  }

  return (
    <div className="signin">
      <div className="signin-card">
        <h1>Inburgering A2</h1>
        <p className="signin-lead">Enter your email address to start.</p>
        <p className="signin-note">
          No password, no email to open. Your progress belongs to this address, so enter the same
          address on your phone and on your laptop.
        </p>
        <form className="signin-form" onSubmit={handleSubmit}>
          <input
            type="email"
            required
            autoFocus
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit">Start</Button>
        </form>
      </div>
    </div>
  )
}
