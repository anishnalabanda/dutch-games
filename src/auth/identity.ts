/**
 * Identity without accounts: whoever types an email address is treated as that
 * person, and progress is keyed to the address. There is no verification, so
 * this is a name tag rather than a login. See supabase/schema.sql.
 *
 * The key deliberately avoids the `nl.` prefix, which LocalStore treats as
 * progress and would otherwise sync the address itself to the cloud.
 */
const EMAIL_KEY = '__nl_email__'

/** Lowercased and trimmed, so one address is one row set however it is typed. */
export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function getEmail(): string | null {
  try {
    return window.localStorage.getItem(EMAIL_KEY)
  } catch {
    return null
  }
}

export function setEmail(email: string) {
  try {
    window.localStorage.setItem(EMAIL_KEY, normaliseEmail(email))
  } catch {
    // Storage blocked: the session lasts until the tab closes, which is the
    // best that can be done without it.
  }
}

export function clearEmail() {
  try {
    window.localStorage.removeItem(EMAIL_KEY)
  } catch {
    // nothing to clean up
  }
}
