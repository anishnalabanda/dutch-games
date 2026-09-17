import { signOut } from '../auth/auth'
import { clearLocalProgress, useAuthSession } from '../store/StoreProvider'
import { Button } from './Button'

export function AuthBar() {
  const { session, cloudSync } = useAuthSession()
  if (!session) return null

  async function handleSignOut() {
    await clearLocalProgress()
    await signOut()
  }

  return (
    <div className="auth-bar">
      <span className="auth-bar-email">{session.user.email}</span>
      {!cloudSync && (
        <span className="auth-bar-status" title="VITE_CLOUD_SYNC=on schakelt sync in">
          Lokaal, geen cloud-sync
        </span>
      )}
      <Button variant="secondary" onClick={() => void handleSignOut()}>
        Sign out
      </Button>
    </div>
  )
}
