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
        <p className="signin-lead">Vul je e-mailadres in om te beginnen.</p>
        <p className="signin-note">
          Geen wachtwoord, geen e-mail om te openen. Je voortgang hoort bij dit adres, dus vul
          hetzelfde adres in op je telefoon en je laptop.
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
          <Button type="submit">Beginnen</Button>
        </form>
      </div>
    </div>
  )
}
